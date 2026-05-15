import Anthropic from '@anthropic-ai/sdk'
import type {
  MessageParam,
  Tool,
  ToolResultBlockParam,
} from '@anthropic-ai/sdk/resources/messages/messages'
import OpenAI from 'openai'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { EmailData } from '@/lib/agents/email-types'
import type { Database } from '@/types/database'
import {
  type ExpenseCategory,
  type ExpenseParseResult,
  EXPENSE_CATEGORIES,
  isExpenseCategory,
} from '@/lib/llm/expense-parse-types'
import { getExpenseParseLlmProvider } from '@/lib/llm/provider'

const ANTHROPIC_MODEL = 'claude-sonnet-4-20250514'
const DEEPSEEK_MODEL = 'deepseek-chat'
const DEEPSEEK_BASE_URL = 'https://api.deepseek.com'
const MAX_TOOL_STEPS = 8

const anthropicExpenseTools: Tool[] = [
  {
    name: 'categorize_transaction',
    description:
      'Classify a debit/expense into one allowed category. Call when you need a structured category decision.',
    input_schema: {
      type: 'object',
      properties: {
        proposed_category: {
          type: 'string',
          enum: [...EXPENSE_CATEGORIES],
        },
        merchant: { type: ['string', 'null'], description: 'Merchant or counterparty if known' },
        note: { type: 'string', description: 'Short rationale (optional)' },
      },
      required: ['proposed_category'],
    },
  },
  {
    name: 'save_expense',
    description:
      'Record the parsed expense in the database. When is_transaction is false, no row is written. Amount is IDR integer.',
    input_schema: {
      type: 'object',
      properties: {
        is_transaction: { type: 'boolean' },
        merchant: { type: ['string', 'null'] },
        amount: { type: ['integer', 'null'] },
        category: { type: 'string', enum: [...EXPENSE_CATEGORIES] },
        expense_date: { type: ['string', 'null'], description: 'YYYY-MM-DD' },
        confidence: { type: 'number', description: '0..1 confidence in this parse' },
      },
      required: ['is_transaction', 'category', 'confidence'],
    },
  },
]

const openaiExpenseTools: OpenAI.Chat.Completions.ChatCompletionTool[] = [
  {
    type: 'function',
    function: {
      name: 'categorize_transaction',
      description:
        'Classify a debit/expense into one allowed category. Call when you need a structured category decision.',
      parameters: {
        type: 'object',
        properties: {
          proposed_category: { type: 'string', enum: [...EXPENSE_CATEGORIES] },
          merchant: { type: ['string', 'null'] },
          note: { type: 'string' },
        },
        required: ['proposed_category'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'save_expense',
      description:
        'Record the parsed expense in the database. When is_transaction is false, no row is written. Amount is IDR integer.',
      parameters: {
        type: 'object',
        properties: {
          is_transaction: { type: 'boolean' },
          merchant: { type: ['string', 'null'] },
          amount: { type: ['integer', 'null'] },
          category: { type: 'string', enum: [...EXPENSE_CATEGORIES] },
          expense_date: { type: ['string', 'null'] },
          confidence: { type: 'number' },
        },
        required: ['is_transaction', 'category', 'confidence'],
      },
    },
  },
]

export interface ParseExpenseWithToolsResult {
  parseResult: ExpenseParseResult
  insertedExpenseId: string | null
}

function emptyParse(category: ExpenseCategory = 'Lainnya'): ExpenseParseResult {
  return {
    is_transaction: false,
    merchant: null,
    amount: null,
    category,
    expense_date: null,
    confidence: 0,
  }
}

function coerceCategory(value: unknown): ExpenseCategory {
  return typeof value === 'string' && isExpenseCategory(value) ? value : 'Lainnya'
}

function buildUserPrompt(emailData: EmailData): string {
  return `Ekstrak transaksi pengeluaran dari email bank/e-commerce berikut, lalu gunakan tools \`categorize_transaction\` (opsional) dan wajib \`save_expense\` untuk menyelesaikan parsing.

Subject: ${emailData.subject}
From: ${emailData.from}
Date: ${emailData.date.toISOString()}
Snippet: ${emailData.snippet}

Email body:
${emailData.body}

Rules:
- Hanya debit/pengeluaran; abaikan kredit/masuk/top-up.
- amount dalam Rupiah sebagai integer (tanpa titik/koma).
- Jika bukan transaksi pengeluaran, panggil save_expense dengan is_transaction: false.
- expense_date format YYYY-MM-DD jika diketahui.
- confidence 0..1.`
}

function parseResultFromSaveInput(input: Record<string, unknown>): ExpenseParseResult {
  const is_transaction = Boolean(input.is_transaction)
  const merchant = typeof input.merchant === 'string' ? input.merchant : null
  const amount = typeof input.amount === 'number' && Number.isFinite(input.amount) ? input.amount : null
  const category = coerceCategory(input.category)
  const expense_date = typeof input.expense_date === 'string' ? input.expense_date : null
  const confidence =
    typeof input.confidence === 'number' && Number.isFinite(input.confidence) ? input.confidence : 0

  return {
    is_transaction,
    merchant,
    amount,
    category,
    expense_date,
    confidence,
  }
}

async function handleSaveExpense(
  supabase: SupabaseClient<Database>,
  userId: string,
  emailData: EmailData,
  input: Record<string, unknown>
): Promise<{ toolJson: Record<string, unknown>; parseResult: ExpenseParseResult; insertedId: string | null }> {
  const parseResult = parseResultFromSaveInput(input)

  if (!parseResult.is_transaction || !parseResult.amount || parseResult.amount <= 0) {
    return {
      toolJson: { saved: false, reason: 'not_a_debit_or_invalid_amount' },
      parseResult: { ...parseResult, is_transaction: false, amount: null },
      insertedId: null,
    }
  }

  const expenseDate = parseResult.expense_date || emailData.date.toISOString().split('T')[0]

  const { data, error } = await supabase
    .from('expense_logs')
    .insert({
      user_id: userId,
      merchant: parseResult.merchant,
      amount: parseResult.amount,
      category: parseResult.category,
      source_email_id: emailData.emailId,
      expense_date: expenseDate,
      raw_email_snippet: emailData.snippet,
    })
    .select('id')
    .single()

  if (error) {
    return {
      toolJson: { saved: false, error: error.message },
      parseResult: { ...parseResult, is_transaction: false, confidence: 0 },
      insertedId: null,
    }
  }

  return {
    toolJson: { saved: true, expense_id: data.id },
    parseResult: { ...parseResult, expense_date: expenseDate },
    insertedId: data.id,
  }
}

function handleCategorizeTransaction(input: Record<string, unknown>): Record<string, unknown> {
  const proposed = input.proposed_category
  const category = coerceCategory(proposed)
  return { category, normalized: category === proposed }
}

function assertAnthropicKey(): void {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error('Missing ANTHROPIC_API_KEY (required when LLM_PROVIDER is anthropic or unset)')
  }
}

function assertDeepseekKey(): void {
  if (!process.env.DEEPSEEK_API_KEY) {
    throw new Error('Missing DEEPSEEK_API_KEY (required when LLM_PROVIDER=deepseek)')
  }
}

async function runAnthropicExpenseToolLoop(
  supabase: SupabaseClient<Database>,
  userId: string,
  emailData: EmailData
): Promise<ParseExpenseWithToolsResult> {
  assertAnthropicKey()
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

  let latest: ExpenseParseResult = emptyParse()
  let insertedExpenseId: string | null = null

  const messages: MessageParam[] = [
    {
      role: 'user',
      content: buildUserPrompt(emailData),
    },
  ]

  for (let step = 0; step < MAX_TOOL_STEPS; step++) {
    const response = await client.messages.create({
      model: ANTHROPIC_MODEL,
      max_tokens: 2048,
      system:
        'You are Boney.AI expense-parser. You must finish by calling save_expense exactly once with your final structured parse.',
      tools: anthropicExpenseTools,
      tool_choice: { type: 'auto' },
      messages,
    })

    const toolUses = response.content.filter((b) => b.type === 'tool_use')

    if (toolUses.length === 0) {
      break
    }

    messages.push({ role: 'assistant', content: response.content })

    const toolResults: ToolResultBlockParam[] = []

    for (const block of toolUses) {
      if (block.type !== 'tool_use') continue
      const input = block.input as Record<string, unknown>

      if (block.name === 'categorize_transaction') {
        const out = handleCategorizeTransaction(input)
        toolResults.push({
          type: 'tool_result',
          tool_use_id: block.id,
          content: JSON.stringify(out),
        })
      } else if (block.name === 'save_expense') {
        const { toolJson, parseResult, insertedId } = await handleSaveExpense(
          supabase,
          userId,
          emailData,
          input
        )
        latest = parseResult
        if (insertedId) {
          insertedExpenseId = insertedId
        }
        toolResults.push({
          type: 'tool_result',
          tool_use_id: block.id,
          content: JSON.stringify(toolJson),
        })
      } else {
        toolResults.push({
          type: 'tool_result',
          tool_use_id: block.id,
          content: JSON.stringify({ error: 'unknown_tool' }),
          is_error: true,
        })
      }
    }

    messages.push({ role: 'user', content: toolResults })

    if (response.stop_reason !== 'tool_use') {
      break
    }
  }

  return { parseResult: latest, insertedExpenseId }
}

type OpenAiMsg = OpenAI.Chat.Completions.ChatCompletionMessageParam

async function runDeepseekExpenseToolLoop(
  supabase: SupabaseClient<Database>,
  userId: string,
  emailData: EmailData
): Promise<ParseExpenseWithToolsResult> {
  assertDeepseekKey()
  const client = new OpenAI({
    apiKey: process.env.DEEPSEEK_API_KEY,
    baseURL: DEEPSEEK_BASE_URL,
  })

  let latest: ExpenseParseResult = emptyParse()
  let insertedExpenseId: string | null = null

  const messages: OpenAiMsg[] = [
    {
      role: 'system',
      content:
        'You are Boney.AI expense-parser. You must finish by calling save_expense exactly once with your final structured parse.',
    },
    { role: 'user', content: buildUserPrompt(emailData) },
  ]

  for (let step = 0; step < MAX_TOOL_STEPS; step++) {
    const completion = await client.chat.completions.create({
      model: DEEPSEEK_MODEL,
      messages,
      tools: openaiExpenseTools,
      tool_choice: 'auto',
    })

    const choice = completion.choices[0]?.message
    if (!choice) break

    const calls = choice.tool_calls
    if (!calls?.length) {
      messages.push(choice)
      break
    }

    messages.push(choice)

    for (const call of calls) {
      if (call.type !== 'function') continue
      let args: Record<string, unknown> = {}
      try {
        args = JSON.parse(call.function.arguments || '{}') as Record<string, unknown>
      } catch {
        args = {}
      }

      if (call.function.name === 'categorize_transaction') {
        const out = handleCategorizeTransaction(args)
        messages.push({
          role: 'tool',
          tool_call_id: call.id,
          content: JSON.stringify(out),
        })
      } else if (call.function.name === 'save_expense') {
        const { toolJson, parseResult, insertedId } = await handleSaveExpense(
          supabase,
          userId,
          emailData,
          args
        )
        latest = parseResult
        if (insertedId) {
          insertedExpenseId = insertedId
        }
        messages.push({
          role: 'tool',
          tool_call_id: call.id,
          content: JSON.stringify(toolJson),
        })
      } else {
        messages.push({
          role: 'tool',
          tool_call_id: call.id,
          content: JSON.stringify({ error: 'unknown_tool' }),
        })
      }
    }
  }

  return { parseResult: latest, insertedExpenseId }
}

export async function parseExpenseWithTools(
  supabase: SupabaseClient<Database>,
  userId: string,
  emailData: EmailData
): Promise<ParseExpenseWithToolsResult> {
  const provider = getExpenseParseLlmProvider()
  if (provider === 'deepseek') {
    return runDeepseekExpenseToolLoop(supabase, userId, emailData)
  }
  return runAnthropicExpenseToolLoop(supabase, userId, emailData)
}
