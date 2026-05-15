export type ExpenseCategory =
  | 'Makanan'
  | 'Transport'
  | 'Belanja'
  | 'Hiburan'
  | 'Kesehatan'
  | 'Langganan'
  | 'Transfer'
  | 'Lainnya'

export const EXPENSE_CATEGORIES: readonly ExpenseCategory[] = [
  'Makanan',
  'Transport',
  'Belanja',
  'Hiburan',
  'Kesehatan',
  'Langganan',
  'Transfer',
  'Lainnya',
] as const

export function isExpenseCategory(value: string): value is ExpenseCategory {
  return (EXPENSE_CATEGORIES as readonly string[]).includes(value)
}

export interface ExpenseParseResult {
  is_transaction: boolean
  merchant: string | null
  amount: number | null
  category: ExpenseCategory
  expense_date: string | null
  confidence: number
}
