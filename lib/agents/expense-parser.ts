import type { EmailData } from '@/lib/agents/email-types'
import { createServiceClient } from '@/lib/supabase/service'
import { parseExpenseWithTools } from '@/lib/llm/parse-expense-with-tools'

export type { EmailData } from '@/lib/agents/email-types'

export async function expenseParserAgent(userId: string, emailData: EmailData): Promise<void> {
  const startTime = Date.now()
  const supabase = createServiceClient()

  const { data: logData } = await supabase
    .from('agent_logs')
    .insert({
      agent_name: 'expense-parser',
      user_id: userId,
      status: 'started',
      input_summary: {
        email_id: emailData.emailId,
        subject: emailData.subject,
        from: emailData.from,
      },
    })
    .select()
    .single()

  const logId = logData?.id

  try {
    const { parseResult, insertedExpenseId } = await parseExpenseWithTools(supabase, userId, emailData)

    console.log(`[Expense Parser] Parse result for ${emailData.emailId}:`, parseResult)

    if (insertedExpenseId) {
      console.log(`[Expense Parser] Saved expense: ${insertedExpenseId}`)
    }

    if (logId) {
      if (insertedExpenseId) {
        await supabase
          .from('agent_logs')
          .update({
            status: 'completed',
            output_summary: {
              is_transaction: true,
              merchant: parseResult.merchant,
              amount: parseResult.amount,
              category: parseResult.category,
              confidence: parseResult.confidence,
            },
            duration_ms: Date.now() - startTime,
          })
          .eq('id', logId)
      } else {
        const reason = parseResult.is_transaction
          ? 'Parsed as transaction but not saved (validation or database error)'
          : 'Not a debit transaction or invalid amount'
        await supabase
          .from('agent_logs')
          .update({
            status: 'completed',
            output_summary: {
              is_transaction: parseResult.is_transaction,
              merchant: parseResult.merchant,
              amount: parseResult.amount,
              category: parseResult.category,
              confidence: parseResult.confidence,
              reason,
            },
            duration_ms: Date.now() - startTime,
          })
          .eq('id', logId)
      }
    }
  } catch (error) {
    console.error('[Expense Parser] Error:', error)

    if (logId) {
      await supabase
        .from('agent_logs')
        .update({
          status: 'failed',
          error_message: String(error),
          duration_ms: Date.now() - startTime,
        })
        .eq('id', logId)
    }

    throw error
  }
}
