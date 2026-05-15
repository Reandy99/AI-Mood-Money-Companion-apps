import { NextRequest, NextResponse } from 'next/server'
import { runScanReceiptsForUser } from '@/lib/agents/run-scan-receipts-for-user'
import { isCronRequestAuthorized } from '@/lib/cron/verify-cron-request'

export async function POST(request: NextRequest) {
  try {
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

    const body = await request.json()
    const { user_id } = body as { user_id?: string }

    if (!user_id) {
      return NextResponse.json({ error: 'user_id required' }, { status: 400 })
    }

    const result = await runScanReceiptsForUser(user_id)

    return NextResponse.json({
      success: true,
      result,
    })
  } catch (error) {
    console.error('Error in scan-receipts endpoint:', error)
    return NextResponse.json(
      { error: 'Failed to scan receipts', details: String(error) },
      { status: 500 }
    )
  }
}
