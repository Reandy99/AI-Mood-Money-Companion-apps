import { receiptScannerAgent } from '@/lib/agents/receipt-scanner'
import { createServiceClient } from '@/lib/supabase/service'

export async function runScanReceiptsForUser(userId: string) {
  const supabase = createServiceClient()
  const { data: user, error } = await supabase
    .from('users')
    .select('gmail_token, gmail_refresh_token')
    .eq('id', userId)
    .single()

  if (error || !user?.gmail_token) {
    throw new Error('User not found or Gmail not connected')
  }

  return receiptScannerAgent(userId, user.gmail_token, user.gmail_refresh_token ?? undefined)
}
