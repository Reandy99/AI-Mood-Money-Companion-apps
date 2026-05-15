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

    // Get today's mood
    const today = new Date().toISOString().split('T')[0]
    const { data: todayMood } = await supabase
      .from('mood_logs')
      .select('*')
      .eq('user_id', user.id)
      .eq('logged_at', today)
      .single()

    // Get last 7 days moods
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    const { data: weeklyMoods } = await supabase
      .from('mood_logs')
      .select('*')
      .eq('user_id', user.id)
      .gte('logged_at', sevenDaysAgo.toISOString().split('T')[0])
      .order('logged_at', { ascending: false })
      .limit(7)

    // Get this week's expenses
    const weekStart = new Date()
    weekStart.setDate(weekStart.getDate() - weekStart.getDay()) // Start of week (Sunday)
    const { data: weeklyExpenses } = await supabase
      .from('expense_logs')
      .select('*')
      .eq('user_id', user.id)
      .gte('expense_date', weekStart.toISOString().split('T')[0])

    // Calculate total expense
    const totalExpense = weeklyExpenses?.reduce((sum, exp) => sum + exp.amount, 0) || 0

    // Calculate dominant mood
    const moodCounts: Record<string, number> = {}
    weeklyMoods?.forEach(mood => {
      moodCounts[mood.mood_type] = (moodCounts[mood.mood_type] || 0) + 1
    })
    const dominantMood = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'neutral'

    // Calculate streak
    let streak = 0
    const sortedMoods = weeklyMoods?.sort((a, b) => 
      new Date(b.logged_at).getTime() - new Date(a.logged_at).getTime()
    ) || []
    
    for (let i = 0; i < sortedMoods.length; i++) {
      const expectedDate = new Date()
      expectedDate.setDate(expectedDate.getDate() - i)
      const expectedDateStr = expectedDate.toISOString().split('T')[0]
      
      if (sortedMoods[i]?.logged_at === expectedDateStr) {
        streak++
      } else {
        break
      }
    }

    return NextResponse.json({
      todayMood,
      weeklyMoods,
      stats: {
        totalExpense,
        dominantMood,
        streak,
        expenseCount: weeklyExpenses?.length || 0
      }
    })
  } catch (error) {
    console.error('Dashboard API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
