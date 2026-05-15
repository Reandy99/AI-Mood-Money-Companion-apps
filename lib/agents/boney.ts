import Anthropic from '@anthropic-ai/sdk'
import { createServiceClient } from '@/lib/supabase/service'

export interface BoneyContext {
  userId: string
  moodHistory: any[]
  weeklyExpense: number
  weeklyInsight: string | null
  topCategory: string | null
  chatHistory: any[]
}

export async function boneyAgent(userId: string, userMessage: string): Promise<ReadableStream> {
  const supabase = createServiceClient()

  // Build context
  const context = await buildBoneyContext(userId)

  // Save user message
  await supabase.from('chat_history').insert({
    user_id: userId,
    role: 'user',
    content: userMessage
  })

  // Check for red flags
  const hasRedFlag = detectRedFlags(userMessage)

  // Build system prompt
  const systemPrompt = buildBoneySystemPrompt(context, hasRedFlag)

  // Initialize Anthropic client
  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY
  })

  // Stream response
  const stream = await anthropic.messages.stream({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    system: systemPrompt,
    messages: [
      ...context.chatHistory.map(msg => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content
      })),
      {
        role: 'user',
        content: userMessage
      }
    ]
  })

  // Convert to web stream and save response
  let fullResponse = ''
  
  const webStream = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
          const text = chunk.delta.text
          fullResponse += text
          controller.enqueue(new TextEncoder().encode(text))
        }
      }

      // Save assistant response
      await supabase.from('chat_history').insert({
        user_id: userId,
        role: 'assistant',
        content: fullResponse
      })

      controller.close()
    }
  })

  return webStream
}

async function buildBoneyContext(userId: string): Promise<BoneyContext> {
  const supabase = createServiceClient()

  // Get mood history (last 7 days)
  const { data: moods } = await supabase
    .from('mood_logs')
    .select('*')
    .eq('user_id', userId)
    .order('logged_at', { ascending: false })
    .limit(7)

  // Get latest weekly report
  const { data: latestReport } = await supabase
    .from('weekly_reports')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  // Get chat history (last 20 messages)
  const { data: chatHistory } = await supabase
    .from('chat_history')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(20)

  return {
    userId,
    moodHistory: moods || [],
    weeklyExpense: latestReport?.total_expense || 0,
    weeklyInsight: latestReport?.insight_text || null,
    topCategory: latestReport?.top_category || null,
    chatHistory: (chatHistory || []).reverse() // oldest first
  }
}

function buildBoneySystemPrompt(context: BoneyContext, hasRedFlag: boolean): string {
  const moodSummary = context.moodHistory
    .map(m => `${m.logged_at}: ${m.mood_label}`)
    .join(', ')

  const basePrompt = `Kamu adalah Boney, AI companion dari RasaKas.

KEPRIBADIAN:
- Teman curhat Gen Z Indonesia (22-28 tahun)
- Warm, empathetic, non-judgmental
- Bahasa santai tapi respectful
- Bisa pakai slang natural (tapi jangan berlebihan)

APPROACH:
1. DENGAR DULU — validasi emosi sebelum kasih insight
2. Pakai data cuma kalau RELEVAN dan NATURAL
3. Jangan langsung kasih solusi — explore dulu
4. Akhiri dengan open-ended question atau validasi

KONTEKS USER:
- Mood 7 hari terakhir: ${moodSummary || 'Belum ada data'}
- Total pengeluaran minggu ini: Rp ${context.weeklyExpense.toLocaleString('id-ID')}
- Kategori pengeluaran dominan: ${context.topCategory || 'Belum ada data'}
${context.weeklyInsight ? `- Insight terbaru: ${context.weeklyInsight.substring(0, 200)}...` : ''}

CARA GUNAKAN KONTEKS:
- Sebutkan data hanya kalau relevan dan natural
- Contoh: "Eh btw gue lihat minggu ini kamu sering cemas ya..." 
  bukan "Berdasarkan data mood kamu..."
- Jangan selalu bawa-bawa data di setiap respons

BATASAN:
- Kamu BUKAN psikolog/terapis
- Jangan diagnosa mental health conditions
- Jangan kasih saran medis/obat

RESPONSE STYLE:
- 2-4 kalimat per response
- Conversational, bukan bullet points
- Akhiri dengan pertanyaan atau validasi`

  if (hasRedFlag) {
    return basePrompt + `

⚠️ RED FLAG DETECTED ⚠️
User menyebutkan hal yang mengkhawatirkan (self-harm/suicidal thoughts).
WAJIB respond dengan empati dan arahkan ke:
"Gue khawatir sama kamu. Coba hubungi Into The Light di 119 ext 8 (24 jam) ya. Mereka lebih qualified untuk bantu kamu 💚"`
  }

  return basePrompt
}

function detectRedFlags(message: string): boolean {
  const redFlagKeywords = [
    'bunuh diri',
    'suicide',
    'mati aja',
    'gak mau hidup',
    'pengen mati',
    'sakiti diri',
    'self harm',
    'mengakhiri hidup',
    'tidak ingin hidup'
  ]

  const lowerMessage = message.toLowerCase()
  return redFlagKeywords.some(keyword => lowerMessage.includes(keyword))
}

// Proactive notification logic
export async function checkAnomalies(userId: string): Promise<string | null> {
  const supabase = createServiceClient()

  // Get today's mood
  const today = new Date().toISOString().split('T')[0]
  const { data: todayMood } = await supabase
    .from('mood_logs')
    .select('*')
    .eq('user_id', userId)
    .eq('logged_at', today)
    .single()

  // Get today's expenses
  const { data: todayExpenses } = await supabase
    .from('expense_logs')
    .select('*')
    .eq('user_id', userId)
    .eq('expense_date', today)

  const todayTotal = todayExpenses?.reduce((sum, e) => sum + e.amount, 0) || 0

  // Get average daily expense (last 7 days)
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
  
  const { data: weekExpenses } = await supabase
    .from('expense_logs')
    .select('*')
    .eq('user_id', userId)
    .gte('expense_date', sevenDaysAgo.toISOString().split('T')[0])

  const avgDaily = weekExpenses && weekExpenses.length > 0
    ? weekExpenses.reduce((sum, e) => sum + e.amount, 0) / 7
    : 0

  // Check anomaly: high spending + negative mood
  if (todayTotal > avgDaily * 2 && todayMood && todayMood.mood_score <= 3) {
    return `Hey, gue notice pengeluaran hari ini udah 2x lipat dari biasanya (Rp ${todayTotal.toLocaleString('id-ID')}), dan mood kamu lagi ${todayMood.mood_label}. Mau ngobrol?`
  }

  // Check consecutive bad moods
  const { data: recentMoods } = await supabase
    .from('mood_logs')
    .select('*')
    .eq('user_id', userId)
    .order('logged_at', { ascending: false })
    .limit(3)

  const consecutiveBad = recentMoods?.every(m => m.mood_score <= 3)
  
  if (consecutiveBad && recentMoods && recentMoods.length >= 3) {
    return `Udah 3 hari mood kamu down terus nih. Gue di sini kalau mau cerita 💚`
  }

  return null
}
