import { ClaudeClient } from '@/lib/claude/client'
import { createServiceClient } from '@/lib/supabase/service'

export interface WeeklyAnalysisResult {
  userId: string
  weekStart: string
  weekEnd: string
  totalExpense: number
  dominantMood: string
  topCategory: string
  insightText: string
  emotionalSpendingAmount: number
}

export async function patternAnalystAgent(userId: string): Promise<WeeklyAnalysisResult> {
  const startTime = Date.now()
  const supabase = createServiceClient()

  // Log agent start
  const { data: logData } = await supabase
    .from('agent_logs')
    .insert({
      agent_name: 'pattern-analyst',
      user_id: userId,
      status: 'started',
      input_summary: {
        user_id: userId,
        analysis_date: new Date().toISOString()
      }
    })
    .select()
    .single()

  const logId = logData?.id

  try {
    // Calculate date range (last 7 days)
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - 7)

    const weekStart = startDate.toISOString().split('T')[0]
    const weekEnd = endDate.toISOString().split('T')[0]

    // Fetch mood logs
    const { data: moods, error: moodError } = await supabase
      .from('mood_logs')
      .select('*')
      .eq('user_id', userId)
      .gte('logged_at', weekStart)
      .lte('logged_at', weekEnd)
      .order('logged_at', { ascending: true })

    if (moodError) throw moodError

    // Fetch expense logs
    const { data: expenses, error: expenseError } = await supabase
      .from('expense_logs')
      .select('*')
      .eq('user_id', userId)
      .gte('expense_date', weekStart)
      .lte('expense_date', weekEnd)
      .order('expense_date', { ascending: true })

    if (expenseError) throw expenseError

    console.log(`[Pattern Analyst] Analyzing ${moods?.length || 0} moods and ${expenses?.length || 0} expenses`)

    // Calculate statistics
    const totalExpense = expenses?.reduce((sum, e) => sum + e.amount, 0) || 0
    
    const dominantMood = moods && moods.length > 0
      ? getMostFrequentMood(moods)
      : 'Netral'

    const topCategory = expenses && expenses.length > 0
      ? getTopCategory(expenses)
      : 'Lainnya'

    // Estimate emotional spending (expenses on days with negative mood)
    const emotionalSpendingAmount = calculateEmotionalSpending(moods || [], expenses || [])

    // Generate AI insight
    const claudeClient = new ClaudeClient()
    const insightText = await claudeClient.analyzeWeeklyPattern(moods || [], expenses || [])

    // Save weekly report
    const { data: report, error: reportError } = await supabase
      .from('weekly_reports')
      .insert({
        user_id: userId,
        week_start: weekStart,
        week_end: weekEnd,
        total_expense: totalExpense,
        dominant_mood: dominantMood,
        mood_expense_correlation: {
          moods: moods?.map(m => ({ date: m.logged_at, mood: m.mood_label, score: m.mood_score })),
          expenses: expenses?.map(e => ({ date: e.expense_date, amount: e.amount, category: e.category }))
        },
        top_category: topCategory,
        insight_text: insightText,
        emotional_spending_amount: emotionalSpendingAmount
      })
      .select()
      .single()

    if (reportError) throw reportError

    console.log(`[Pattern Analyst] Created weekly report: ${report.id}`)

    const duration = Date.now() - startTime

    // Log completion
    if (logId) {
      await supabase
        .from('agent_logs')
        .update({
          status: 'completed',
          output_summary: {
            report_id: report.id,
            total_expense: totalExpense,
            dominant_mood: dominantMood,
            top_category: topCategory
          },
          duration_ms: duration
        })
        .eq('id', logId)
    }

    return {
      userId,
      weekStart,
      weekEnd,
      totalExpense,
      dominantMood,
      topCategory,
      insightText,
      emotionalSpendingAmount
    }
  } catch (error) {
    console.error('[Pattern Analyst] Error:', error)

    // Log failure
    if (logId) {
      await supabase
        .from('agent_logs')
        .update({
          status: 'failed',
          error_message: String(error),
          duration_ms: Date.now() - startTime
        })
        .eq('id', logId)
    }

    throw error
  }
}

function getMostFrequentMood(moods: any[]): string {
  const moodCounts = moods.reduce((acc, m) => {
    acc[m.mood_label] = (acc[m.mood_label] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0][0]
}

function getTopCategory(expenses: any[]): string {
  const categoryCounts = expenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount
    return acc
  }, {} as Record<string, number>)

  return Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0][0]
}

function calculateEmotionalSpending(moods: any[], expenses: any[]): number {
  // Moods with score <= 3 are considered negative
  const negativeMoodDates = new Set(
    moods.filter(m => m.mood_score <= 3).map(m => m.logged_at)
  )

  return expenses
    .filter(e => negativeMoodDates.has(e.expense_date))
    .reduce((sum, e) => sum + e.amount, 0)
}
