import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const user_id = searchParams.get('user_id')

    if (!user_id) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 400 }
      )
    }

    const supabase = createServiceClient()
    const today = new Date().toISOString().split('T')[0]

    const { data, error } = await supabase
      .from('mood_logs')
      .select('*')
      .eq('user_id', user_id)
      .eq('logged_at', today)
      .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      throw error
    }

    return NextResponse.json({
      success: true,
      has_checked_in: !!data,
      mood_log: data || null,
      edits_remaining: data ? 2 - data.edit_count : 2
    })
  } catch (error) {
    console.error('Error checking today mood:', error)
    return NextResponse.json(
      { error: 'Failed to check mood status' },
      { status: 500 }
    )
  }
}
