import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'

/**
 * GET /api/summary/today
 * Get today's daily summary for current user
 */
export async function GET(request: NextRequest) {
  try {
    // TODO: Get user from session
    const userId = 'demo-user-123' // Replace with actual auth

    const supabase = createServiceClient()
    const today = new Date().toISOString().split('T')[0]

    const { data: summary, error } = await supabase
      .from('daily_summaries')
      .select('*')
      .eq('user_id', userId)
      .eq('summary_date', today)
      .single()

    if (error && error.code !== 'PGRST116') {
      throw error
    }

    if (!summary) {
      return NextResponse.json({
        message: 'No summary for today yet',
        summary: null
      })
    }

    return NextResponse.json({ summary })
  } catch (error) {
    console.error('[Summary API] Error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    )
  }
}

