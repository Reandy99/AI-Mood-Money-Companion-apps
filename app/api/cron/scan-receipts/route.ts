import { NextRequest, NextResponse } from 'next/server'
import { runScanReceiptsForUser } from '@/lib/agents/run-scan-receipts-for-user'
import { fetchAllUserIdsForCron } from '@/lib/cron/fetch-user-ids-for-cron'
import { sanitizeAgentErrorMessage } from '@/lib/cron/sanitize-agent-error'
import { isCronRequestAuthorized } from '@/lib/cron/verify-cron-request'
import { createServiceClient } from '@/lib/supabase/service'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET
  if (!secret) {
    return NextResponse.json(
      { error: 'Server misconfiguration: CRON_SECRET is not set' },
      { status: 500 }
    )
  }

  if (!isCronRequestAuthorized(request, secret)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createServiceClient()
  let userIds: string[]
  try {
    userIds = await fetchAllUserIdsForCron(supabase)
  } catch (e) {
    return NextResponse.json(
      { error: 'Failed to list users', message: sanitizeAgentErrorMessage(e) },
      { status: 500 }
    )
  }

  const errors: { userId?: string; message: string }[] = []
  let processed = 0

  for (const userId of userIds) {
    try {
      await runScanReceiptsForUser(userId)
      processed++
    } catch (e) {
      const msg = sanitizeAgentErrorMessage(e)
      if (msg.includes('Gmail not connected') || msg.includes('User not found')) {
        errors.push({ userId, message: 'Skipped: Gmail not connected or user not found' })
      } else {
        errors.push({ userId, message: msg })
      }
    }
  }

  return NextResponse.json({ processed, errors })
}
