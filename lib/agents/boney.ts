import Anthropic from '@anthropic-ai/sdk'
import { createServiceClient } from '@/lib/supabase/service'
import type { Database } from '@/types/database'
import { ragSearchAgent, detectRAGTopic } from './rag-search'

type MoodLogRow = Database['public']['Tables']['mood_logs']['Row']
type ChatHistoryRow = Database['public']['Tables']['chat_history']['Row']

export interface BoneyContext {
  userId: string
  moodHistory: MoodLogRow[]
  weeklyExpense: number
  weeklyInsight: string | null
  topCategory: string | null
  chatHistory: ChatHistoryRow[]
  ragContext?: string
  ragSources?: string[]
}

export type BoneyMode = 'listen' | 'humor' | 'solution'

export async function boneyAgent(userId: string, userMessage: string): Promise<ReadableStream> {
  const supabase = createServiceClient()

  // Build context
  const context = await buildBoneyContext(userId, userMessage)

  // Save user message
  await supabase.from('chat_history').insert({
    user_id: userId,
    role: 'user',
    content: userMessage
  })

  // Check for red flags
  const hasRedFlag = detectRedFlags(userMessage)

  // Detect Boney mode based on conversation
  const boneyMode = detectBoneyMode(userMessage, context)

  // Build system prompt with RAG context
  const systemPrompt = buildBoneySystemPrompt(context, hasRedFlag, boneyMode)

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

      // Save assistant response with mode and RAG info
      await supabase.from('chat_history').insert({
        user_id: userId,
        role: 'assistant',
        content: fullResponse,
        boney_mode: boneyMode,
        rag_used: !!context.ragContext,
        rag_sources: context.ragSources || null
      })

      controller.close()
    }
  })

  return webStream
}

async function buildBoneyContext(userId: string, userMessage: string): Promise<BoneyContext> {
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

  // Check if RAG search is needed
  const ragTopic = detectRAGTopic(userMessage)
  let ragContext: string | undefined
  let ragSources: string[] | undefined

  if (ragTopic) {
    try {
      const ragResult = await ragSearchAgent(ragTopic)
      ragContext = ragResult.snippets
        .map(s => `[${s.title}]\n${s.text}\nSumber: ${s.source_url}`)
        .join('\n\n')
      ragSources = ragResult.snippets.map(s => s.source_url)
      console.log(`[Boney] RAG activated for topic: ${ragTopic}`)
    } catch (error) {
      console.error('[Boney] RAG search failed:', error)
    }
  }

  return {
    userId,
    moodHistory: moods || [],
    weeklyExpense: latestReport?.total_expense || 0,
    weeklyInsight: latestReport?.insight_text || null,
    topCategory: latestReport?.top_category || null,
    chatHistory: (chatHistory || []).reverse(), // oldest first
    ragContext,
    ragSources
  }
}

function detectBoneyMode(message: string, context: BoneyContext): BoneyMode {
  const lowerMessage = message.toLowerCase()

  // Solution mode: user explicitly asks for advice
  if (
    lowerMessage.includes('gimana') ||
    lowerMessage.includes('cara') ||
    lowerMessage.includes('saran') ||
    lowerMessage.includes('solusi') ||
    lowerMessage.includes('tips')
  ) {
    return 'solution'
  }

  // Humor mode: conversation is getting heavy, need lightening
  const recentMoods = context.moodHistory.slice(0, 3)
  const allNegative = recentMoods.every(m => m.mood_score <= 3)
  const conversationLength = context.chatHistory.length

  if (allNegative && conversationLength > 4) {
    return 'humor'
  }

  // Default: listen mode
  return 'listen'
}

function buildBoneySystemPrompt(context: BoneyContext, hasRedFlag: boolean, mode: BoneyMode): string {
  const moodSummary = context.moodHistory
    .map(m => `${m.logged_at}: ${m.mood_label}`)
    .join(', ')

  // Mode-specific instructions
  const modeInstructions = {
    listen: `MODE: DENGERIN (Active Listening)
- Fokus jadi pendengar aktif
- Parafrase apa yang user bilang
- Validasi perasaan mereka
- Tanya pertanyaan yang bikin user bisa eksplorasi lebih dalam
- JANGAN terburu-buru kasih solusi
- Akhiri dengan pertanyaan terbuka`,
    
    humor: `MODE: HUMOR & HEALING
- Conversation udah cukup dalam, saatnya lighten the mood
- Pakai humor yang relevan dan empathetic
- Reframe situasi dengan cara yang bikin senyum
- Bisa pakai analogi lucu atau meme mental health
- Tetap validasi perasaan, tapi bantu user lihat sisi lain`,
    
    solution: `MODE: SOLUSI PRAKTIS
- User udah siap untuk actionable advice
- Kasih teknik konkret dan praktis
- Adaptasi ke konteks Indonesia (bukan saran generik barat)
- Tetap empathetic, bukan menggurui
- Bisa sebut sumber referensi secara casual`
  }

  const basePrompt = `Kamu adalah Boney, AI companion dari Boney.AI.

KEPRIBADIAN:
- Nama: Boney (bukan "Kasa" atau nama lain)
- Teman curhat Gen Z Indonesia (22-28 tahun)
- Warm, empathetic, non-judgmental
- Bahasa: santai, campur gaul Indonesia yang natural — kayak temen yang pernah baca buku psikologi tapi nggak sok formal
- Bisa serius tapi juga bisa bercanda tepat waktu
- Tahu kapan harus dengerin, kapan harus bikin ketawa, kapan harus kasih insight konkret

${modeInstructions[mode]}

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

${context.ragContext ? `
REFERENSI DARI WEB (RAG):
${context.ragContext}

CARA GUNAKAN REFERENSI:
- Jangan mengutip mentah-mentah
- Olah jadi respons yang natural dan personal
- Sebut sumber secara casual di akhir kalau relevan: "Gue baca artikel bagus soal ini btw, mau gue share?"
- Kombinasikan: empati personal + insight dari referensi + konteks data user
` : ''}

CARA GUNAKAN KONTEKS:
- Sebutkan data hanya kalau RELEVAN dan NATURAL
- Contoh BAIK: "Eh btw gue lihat minggu ini kamu sering cemas ya..." 
- Contoh BURUK: "Berdasarkan data mood kamu..."
- Jangan selalu bawa-bawa data di setiap respons

BATASAN:
- Kamu BUKAN psikolog/terapis
- Jangan diagnosa mental health conditions
- Jangan kasih saran medis/obat
- Semua referensi dari RAG adalah bahan percakapan, bukan diagnosis atau resep

RESPONSE STYLE:
- 2-4 kalimat per response (bisa lebih kalau mode solution dan ada referensi)
- Conversational, bukan bullet points
- Akhiri dengan pertanyaan terbuka atau validasi`

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
