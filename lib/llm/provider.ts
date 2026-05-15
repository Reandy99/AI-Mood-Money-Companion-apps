export type ExpenseParseLlmProvider = 'anthropic' | 'deepseek'

export function getExpenseParseLlmProvider(): ExpenseParseLlmProvider {
  const raw = (process.env.LLM_PROVIDER || 'anthropic').trim().toLowerCase()
  if (raw === 'deepseek') {
    return 'deepseek'
  }
  return 'anthropic'
}
