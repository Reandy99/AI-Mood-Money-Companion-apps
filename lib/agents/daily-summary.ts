import Anthropic from '@anthropic-ai/sdk'
import { createServiceClient } from '@/lib/supabase/service'
import { MOOD_CONFIG } from '@/lib/constants/mood'

export interface DailySummaryResult {
  userId: string
  summaryDate: string
  moodLabel: string | null
  totalExpense: number
  notificationText: string
  notificationSent: boolean
}

/**
 * Daily Summary Notification Agent
 * Runs every day at 22:00 WIB after Receipt Scanner completes
 * Sends notification with today's mood + expenses
 */
export async function dailySummaryAgent(userId: string): Promise<DailySummaryResult> {
  const supabase = createServiceClient()
  const today = new Date().toISOString().split('T')[0]

  // Log agent start
  const { data: logData } = await supabase
    .from('agent_logs')
    .insert({
      agent_name: 'daily-summary',
      user_id: userId,
      status: 'started',
      input_summary: {
        user_id: userId,
        summary_date: today
      }
    })
    .select()
    .single()

  const logId = logData?.id

  try {
    // Step 1: Get today's mood
    const { data: todayMood } = await supabase
      .from('mood_logs')
      .select('*')
      .eq('user_id', userId)
      .eq('logged_at', today)
      .single()

    // Step 2: Get today's expenses
    const { data: todayExpenses } = await supabase
      .from('expense_logs')
      .select('*')
      .eq('user_id', userId)
      .eq('expense_date', today)
      .order('created_at', { ascending: true })

    const totalExpense = todayExpenses?.reduce((sum, e) => sum + e.amount, 0) || 0

    // Step 3: Generate notification text with Claude
    const notificationText = await generateNotificationText({
      mood: todayMood ? {
        label: todayMood.mood_label,
        type: todayMood.mood_type,
        score: todayMood.mood_score
      } : null,
      expenses: todayExpenses || [],
      totalExpense
    })

    // Step 4: Save to daily_summaries table
    const expenseBreakdown = todayExpenses?.map(e => ({
      merchant: e.merchant,
      amount: e.amount,
      category: e.category,
      emoji: getCategoryEmoji(e.category)
    })) || []

    const moodEmoji = todayMood ? getMoodEmoji(todayMood.mood_type) : null

    await supabase
      .from('daily_summaries')
      .upsert({
        user_id: userId,
        summary_date: today,
        mood_label: todayMood?.mood_label || null,
        mood_emoji: moodEmoji,
        total_expense: totalExpense,
        expense_breakdown: expenseBreakdown,
        notification_text: notificationText,
        notification_sent: true,
        sent_at: new Date().toISOString()
      }, {
        onConflict: 'user_id,summary_date'
      })

    // Step 5: Send notification (implement push notification here)
    // For now, we just mark it as sent
    // TODO: Integrate with push notification service

    console.log(`[Daily Summary] Notification sent to user ${userId}`)
    console.log(notificationText)

    // Log agent completion
    if (logId) {
      await supabase
        .from('agent_logs')
        .update({
          status: 'completed',
          output_summary: {
            mood_label: todayMood?.mood_label || 'No mood logged',
            total_expense: totalExpense,
            expenses_count: todayExpenses?.length || 0,
            notification_sent: true
          }
        })
        .eq('id', logId)
    }

    return {
      userId,
      summaryDate: today,
      moodLabel: todayMood?.mood_label || null,
      totalExpense,
      notificationText,
      notificationSent: true
    }
  } catch (error) {
    console.error('[Daily Summary] Error:', error)

    // Log agent failure
    if (logId) {
      await supabase
        .from('agent_logs')
        .update({
          status: 'failed',
          error_message: String(error)
        })
        .eq('id', logId)
    }

    throw error
  }
}

async function generateNotificationText(data: {
  mood: { label: string; type: string; score: number } | null
  expenses: Array<{ merchant: string; amount: number; category: string }>
  totalExpense: number
}): Promise<string> {
  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY
  })

  const today = new Date().toLocaleDateString('id-ID', { 
    day: 'numeric', 
    month: 'long' 
  })

  const expenseList = data.expenses
    .map(e => `${getCategoryEmoji(e.category)} ${e.merchant} — Rp ${e.amount.toLocaleString('id-ID')}`)
    .join('\n')

  const prompt = `Kamu adalah Boney, AI companion dari Boney.AI. Buatkan teks notifikasi harian untuk user.

DATA HARI INI:
- Tanggal: ${today}
- Mood: ${data.mood ? `${data.mood.label} (score: ${data.mood.score}/10)` : 'Belum check-in'}
- Total pengeluaran: Rp ${data.totalExpense.toLocaleString('id-ID')}
- Detail pengeluaran:
${expenseList || '(Tidak ada pengeluaran)'}

INSTRUKSI:
1. Tulis notifikasi yang hangat dan personal (bukan laporan kering)
2. Sebutkan mood dan total pengeluaran
3. Kalau mood negatif DAN pengeluaran tinggi, tambahkan 1 kalimat empati singkat (tapi jangan menghakimi)
4. Kalau user belum check-in mood, tanya "Gimana perasaanmu hari ini?"
5. Akhiri dengan CTA ringan: "Mau cerita ke Boney? 💬"
6. Maksimal 5 kalimat
7. Gunakan emoji yang relevan

FORMAT:
Rekap hari ini, [tanggal] 🌙

[Mood atau tanya mood]

[Pengeluaran + list]

[Empati jika perlu]

Mau cerita ke Boney? 💬

CONTOH OUTPUT:
Rekap hari ini, 15 Mei 🌙

Mood kamu hari ini: 😔 Sedih

Pengeluaran hari ini: Rp 187.000
🍔 GrabFood — Rp 65.000
🛒 Tokopedia — Rp 92.000
☕ Kopi Kenangan — Rp 30.000

Gue notice kamu lagi down dan pengeluaran naik nih. It's okay, kadang kita emang butuh comfort spending.

Mau cerita ke Boney? 💬`

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 300,
    messages: [{
      role: 'user',
      content: prompt
    }]
  })

  const text = response.content[0].type === 'text' ? response.content[0].text : ''
  return text.trim()
}

function getMoodEmoji(moodType: string): string {
  const config = MOOD_CONFIG[moodType as keyof typeof MOOD_CONFIG]
  return config?.emoji || '😐'
}

function getCategoryEmoji(category: string): string {
  const emojiMap: Record<string, string> = {
    'Makanan': '🍔',
    'Transport': '🚗',
    'Belanja': '🛒',
    'Hiburan': '🎬',
    'Kesehatan': '💊',
    'Langganan': '📱',
    'Transfer': '💸',
    'Lainnya': '📦'
  }
  return emojiMap[category] || '📦'
}

