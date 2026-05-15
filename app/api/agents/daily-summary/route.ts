import { NextRequest, NextResponse } from 'next/server'
import { dailySummaryAgent } from '@/lib/agents/daily-summary'
import { createServiceClient } from '@/lib/supabase/service'

/**
 * POST /api/agents/daily-summary
 * Trigger Daily Summary Notification Agent
 * Runs automatically at 22:00 WIB via cron
 * Can also be triggered manually for demo
 */
export async function POST(request: NextRequest) {
  try {
    // Verify cron secret
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET

    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get all users who need daily summary
    const supabase = createServiceClient()
    const { data: users } = await supabase
      .from('users')
      .select('id, email')
      .not('gmail_token', 'is', null) // Only users with Gmail connected

    if (!users || users.length === 0) {
      return NextResponse.json({
        message: 'No users to process',
        processed: 0
      })
    }

    // Process each user
    const results = []
    for (const user of users) {
      try {
        const result = await dailySummaryAgent(user.id)
        results.push({
          userId: user.id,
          email: user.email,
          success: true,
          ...result
        })
      } catch (error) {
        console.error(`[Daily Summary API] Error for user ${user.id}:`, error)
        results.push({
          userId: user.id,
          email: user.email,
          success: false,
          error: String(error)
        })
      }
    }

    const successCount = results.filter(r => r.success).length

    return NextResponse.json({
      message: `Daily summary sent to ${successCount}/${users.length} users`,
      results
    })
  } catch (error) {
    console.error('[Daily Summary API] Error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    )
  }
}

