import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient()

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get latest weekly report
    const { data: report, error } = await supabase
      .from('weekly_reports')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      throw error
    }

    if (!report) {
      return NextResponse.json({
        report: null,
        message: 'No weekly report available yet'
      })
    }

    // Get mood and expense data for the report period
    const { data: moods } = await supabase
      .from('mood_logs')
      .select('*')
      .eq('user_id', user.id)
      .gte('logged_at', report.week_start)
      .lte('logged_at', report.week_end)
      .order('logged_at', { ascending: true })

    const { data: expenses } = await supabase
      .from('expense_logs')
      .select('*')
      .eq('user_id', user.id)
      .gte('expense_date', report.week_start)
      .lte('expense_date', report.week_end)
      .order('expense_date', { ascending: true })

    return NextResponse.json({
      report,
      moods: moods || [],
      expenses: expenses || []
    })
  } catch (error) {
    console.error('Report API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
