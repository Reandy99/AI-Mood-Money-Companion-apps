import Anthropic from '@anthropic-ai/sdk'

type MoodRowForInsight = {
  mood_label: string
  mood_score: number
  logged_at: string
}

type ExpenseRowForInsight = {
  amount: number
  category: string
  expense_date: string
}

export class ClaudeClient {
  private client: Anthropic

  constructor() {
    this.client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY
    })
  }

  async analyzeWeeklyPattern(
    moods: MoodRowForInsight[],
    expenses: ExpenseRowForInsight[]
  ): Promise<string> {
    try {
      const stats = {
        totalExpense: expenses.reduce((sum, e) => sum + e.amount, 0),
        avgDailyExpense: expenses.length > 0 ? expenses.reduce((sum, e) => sum + e.amount, 0) / 7 : 0,
        dominantMood: this.getMostFrequentMood(moods),
        expenseByCategory: this.groupByCategory(expenses),
        moodByDay: moods.map(m => ({ date: m.logged_at, mood: m.mood_label, score: m.mood_score }))
      }

      const prompt = `Kamu adalah financial wellness analyst yang ahli psikologi keuangan.
Analisis data mood dan pengeluaran 7 hari ini.

Data:
${JSON.stringify(stats, null, 2)}

Temukan dan jelaskan:
1. Apakah ada korelasi antara mood negatif dan pengeluaran tinggi?
2. Hari/mood apa yang paling boros?
3. Kategori apa yang dominan saat kondisi emosi buruk?
4. Satu pujian spesifik berdasarkan data (cari hal positif)
5. Satu saran konkret dan actionable untuk minggu depan

Gaya bahasa: Bahasa Indonesia, santai, tidak menghakimi, seperti teman yang perhatian.
Panjang: maksimal 4 kalimat per poin.
Tone: warm, encouraging, tidak scary.

Format response dalam paragraf natural, bukan bullet points.`

      const message = await this.client.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2048,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      })

      const responseText = message.content[0].type === 'text' 
        ? message.content[0].text 
        : 'Belum ada insight yang cukup untuk minggu ini.'

      return responseText
    } catch (error) {
      console.error('Error analyzing weekly pattern:', error)
      return 'Maaf, gagal menganalisis pola minggu ini. Coba lagi nanti ya!'
    }
  }

  private getMostFrequentMood(moods: MoodRowForInsight[]): string {
    if (moods.length === 0) return 'Netral'
    
    const moodCounts = moods.reduce((acc, m) => {
      acc[m.mood_label] = (acc[m.mood_label] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0][0]
  }

  private groupByCategory(expenses: ExpenseRowForInsight[]): Record<string, number> {
    return expenses.reduce((acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + e.amount
      return acc
    }, {} as Record<string, number>)
  }
}
