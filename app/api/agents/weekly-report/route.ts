import { NextRequest, NextResponse } from 'next/server'
import { runWeeklyReportForUser } from '@/lib/agents/run-weekly-report-for-user'
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

    const result = await runWeeklyReportForUser(user_id)

    return NextResponse.json({
      success: true,
      result,
    })
  } catch (error) {
    console.error('Error in weekly-report endpoint:', error)
    return NextResponse.json(
      { error: 'Failed to generate weekly report', details: String(error) },
      { status: 500 }
    )
  }
}
