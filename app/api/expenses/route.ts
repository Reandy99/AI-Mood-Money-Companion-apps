import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || 'week' // week, month, all

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    let startDate: Date
    const today = new Date()

    switch (period) {
      case 'today':
        startDate = today
        break
      case 'week':
        startDate = new Date()
        startDate.setDate(startDate.getDate() - 7)
        break
      case 'month':
        startDate = new Date()
        startDate.setDate(startDate.getDate() - 30)
        break
      default:
        startDate = new Date(0) // All time
    }

    const { data: expenses, error } = await supabase
      .from('expense_logs')
      .select('*')
      .eq('user_id', user.id)
      .gte('expense_date', startDate.toISOString().split('T')[0])
      .order('expense_date', { ascending: false })

    if (error) {
      throw error
    }

    // Calculate summary
    const total = expenses?.reduce((sum: number, exp) => sum + exp.amount, 0) || 0
    const categoryCounts: Record<string, { count: number; total: number }> = {}

    expenses?.forEach((exp) => {
      if (!categoryCounts[exp.category]) {
        categoryCounts[exp.category] = { count: 0, total: 0 }
      }
      categoryCounts[exp.category].count++
      categoryCounts[exp.category].total += exp.amount
    })

    const topCategory = Object.entries(categoryCounts)
      .sort((a, b) => b[1].total - a[1].total)[0]?.[0] || null

    return NextResponse.json({
      expenses: expenses || [],
      summary: {
        total,
        count: expenses?.length || 0,
        topCategory,
        byCategory: categoryCounts
      }
    })
  } catch (error) {
    console.error('Expenses API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
