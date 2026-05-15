import { createServiceClient } from '@/lib/supabase/service'

export interface RAGSearchResult {
  query: string
  snippets: Array<{
    text: string
    source_url: string
    title: string
  }>
  cached: boolean
}

/**
 * RAG (Retrieval-Augmented Generation) Search Agent
 * Searches web for relevant mental health & financial wellness content
 * Caches results for 24 hours
 */
export async function ragSearchAgent(query: string): Promise<RAGSearchResult> {
  const supabase = createServiceClient()

  // Step 1: Check cache first
  const { data: cachedResult } = await supabase
    .from('rag_cache')
    .select('*')
    .eq('query', query)
    .gt('expires_at', new Date().toISOString())
    .single()

  if (cachedResult) {
    console.log(`[RAG] Cache hit for query: ${query}`)
    return {
      query,
      snippets: cachedResult.content_snippets as Array<{
        text: string
        source_url: string
        title: string
      }>,
      cached: true
    }
  }

  // Step 2: Perform web search
  console.log(`[RAG] Cache miss, performing web search for: ${query}`)
  
  // TODO: Integrate with actual web search API
  // For now, return mock data
  // In production, use: Tavily API, Serper API, or Google Custom Search
  
  const mockSnippets = await performWebSearch(query)

  // Step 3: Cache the results (expires in 24 hours)
  const expiresAt = new Date()
  expiresAt.setHours(expiresAt.getHours() + 24)

  await supabase
    .from('rag_cache')
    .insert({
      query,
      content_snippets: mockSnippets,
      source_urls: mockSnippets.map(s => s.source_url),
      expires_at: expiresAt.toISOString()
    })

  return {
    query,
    snippets: mockSnippets,
    cached: false
  }
}

async function performWebSearch(query: string): Promise<Array<{
  text: string
  source_url: string
  title: string
}>> {
  // TODO: Implement actual web search
  // Priority sources:
  // 1. Riliv, Halodoc, Into The Light, Alodokter (Indonesia mental health)
  // 2. Psychology Today Indonesia, Tirto.id health, Kumparan wellbeing
  // 3. Reddit r/indonesia (verified threads)
  // 4. Academic journals with public summaries

  // For demo purposes, return mock data
  const mockResults = [
    {
      text: 'Quarter life crisis adalah fase transisi yang dialami banyak Gen Z Indonesia usia 22-28 tahun. Ditandai dengan perasaan stuck, membandingkan diri dengan orang lain, dan kehilangan arah. Cara mengatasinya: fokus pada progress pribadi, bukan milestone orang lain.',
      source_url: 'https://www.halodoc.com/artikel/quarter-life-crisis-gen-z',
      title: 'Mengatasi Quarter Life Crisis di Usia 20an - Halodoc'
    },
    {
      text: 'Emotional spending adalah pola belanja impulsif yang dipicu oleh emosi negatif. Penelitian menunjukkan 68% Gen Z Indonesia melakukan emotional spending saat stres atau sedih. Teknik menghentikannya: pause 15 menit sebelum checkout, identifikasi trigger emosi.',
      source_url: 'https://www.riliv.co/artikel/emotional-spending-gen-z',
      title: 'Emotional Spending: Kenapa Kita Belanja Saat Sedih? - Riliv'
    }
  ]

  return mockResults
}

/**
 * Detect topic from user message for RAG search
 */
export function detectRAGTopic(message: string): string | null {
  const lowerMessage = message.toLowerCase()

  // Mental health topics
  if (lowerMessage.includes('quarter life') || lowerMessage.includes('stuck')) {
    return 'quarter life crisis Gen Z Indonesia cara mengatasi'
  }
  
  if (lowerMessage.includes('burnout') || lowerMessage.includes('kelelahan kerja')) {
    return 'burnout kerja muda healing tips praktis Indonesia'
  }

  if (lowerMessage.includes('cemas') || lowerMessage.includes('anxiety')) {
    return 'mengatasi kecemasan anxiety Gen Z Indonesia'
  }

  if (lowerMessage.includes('depresi') || lowerMessage.includes('sedih terus')) {
    return 'depresi Gen Z Indonesia cara mengatasi'
  }

  // Financial wellness topics
  if (lowerMessage.includes('belanja terus') || lowerMessage.includes('boros')) {
    return 'emotional spending psychology cara berhenti'
  }

  if (lowerMessage.includes('nabung') || lowerMessage.includes('saving')) {
    return 'tips menabung Gen Z Indonesia financial wellness'
  }

  // Relationship topics
  if (lowerMessage.includes('toxic') || lowerMessage.includes('hubungan')) {
    return 'toxic relationship tanda-tanda cara keluar'
  }

  // Sleep & wellness
  if (lowerMessage.includes('insomnia') || lowerMessage.includes('susah tidur')) {
    return 'insomnia overthinking cara mengatasi Gen Z'
  }

  return null
}

