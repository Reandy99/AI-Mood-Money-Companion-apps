import { createClient } from '@supabase/supabase-js'
import { MOOD_CONFIG } from '../lib/constants/mood'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function seedDemoData() {
  console.log('🌱 Starting seed process...')

  // Create demo user
  const demoUser = {
    email: 'demo@rasakas.app',
    name: 'Demo User',
    onboarded_at: new Date().toISOString()
  }

  const { data: user, error: userError } = await supabase
    .from('users')
    .upsert(demoUser, { onConflict: 'email' })
    .select()
    .single()

  if (userError) {
    console.error('Error creating user:', userError)
    return
  }

  console.log('✅ Demo user created:', user.id)

  // Seed mood logs (last 30 days)
  const moodLogs = []
  const moodTypes = Object.keys(MOOD_CONFIG) as Array<keyof typeof MOOD_CONFIG>
  
  for (let i = 0; i < 30; i++) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    const dateStr = date.toISOString().split('T')[0]
    
    // Weighted random mood (more positive moods)
    let randomMood: keyof typeof MOOD_CONFIG
    const rand = Math.random()
    if (rand < 0.3) randomMood = 'happy'
    else if (rand < 0.5) randomMood = 'calm'
    else if (rand < 0.65) randomMood = 'neutral'
    else if (rand < 0.75) randomMood = 'tired'
    else if (rand < 0.85) randomMood = 'anxious'
    else if (rand < 0.92) randomMood = 'sad'
    else if (rand < 0.96) randomMood = 'frustrated'
    else randomMood = 'angry'

    const config = MOOD_CONFIG[randomMood]

    moodLogs.push({
      user_id: user.id,
      mood_type: randomMood,
      mood_score: config.score,
      mood_label: config.label,
      logged_at: dateStr,
      edit_count: 0
    })
  }

  const { error: moodError } = await supabase
    .from('mood_logs')
    .upsert(moodLogs, { onConflict: 'user_id,logged_at' })

  if (moodError) {
    console.error('Error seeding moods:', moodError)
  } else {
    console.log('✅ Seeded 30 days of mood logs')
  }

  // Seed expense logs (last 14 days)
  const expenseLogs = []
  const categories = ['Makanan', 'Transport', 'Belanja', 'Hiburan', 'Kesehatan', 'Langganan']
  const merchants = [
    'Grab', 'GoFood', 'Indomaret', 'Tokopedia', 'Shopee',
    'Starbucks', 'KFC', 'Warteg', 'Alfamart', 'Netflix',
    'Spotify', 'Transjakarta', 'Klinik', 'Gym'
  ]

  for (let i = 0; i < 14; i++) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    const dateStr = date.toISOString().split('T')[0]
    
    // 2-5 transactions per day
    const transactionsPerDay = Math.floor(Math.random() * 4) + 2
    
    for (let j = 0; j < transactionsPerDay; j++) {
      const category = categories[Math.floor(Math.random() * categories.length)]
      const merchant = merchants[Math.floor(Math.random() * merchants.length)]
      
      // Amount based on category
      let amount
      if (category === 'Makanan') amount = Math.floor(Math.random() * 100000) + 20000
      else if (category === 'Transport') amount = Math.floor(Math.random() * 50000) + 10000
      else if (category === 'Belanja') amount = Math.floor(Math.random() * 300000) + 50000
      else if (category === 'Hiburan') amount = Math.floor(Math.random() * 150000) + 30000
      else if (category === 'Langganan') amount = Math.floor(Math.random() * 100000) + 50000
      else amount = Math.floor(Math.random() * 200000) + 50000

      expenseLogs.push({
        user_id: user.id,
        merchant,
        amount,
        category,
        expense_date: dateStr,
        source_email_id: `demo-${dateStr}-${j}`,
        raw_email_snippet: `Demo transaction from ${merchant}`
      })
    }
  }

  const { error: expenseError } = await supabase
    .from('expense_logs')
    .upsert(expenseLogs, { onConflict: 'source_email_id' })

  if (expenseError) {
    console.error('Error seeding expenses:', expenseError)
  } else {
    console.log(`✅ Seeded ${expenseLogs.length} expense logs`)
  }

  // Seed weekly report
  const weekStart = new Date()
  weekStart.setDate(weekStart.getDate() - 7)
  const weekEnd = new Date()

  const weeklyReport = {
    user_id: user.id,
    week_start: weekStart.toISOString().split('T')[0],
    week_end: weekEnd.toISOString().split('T')[0],
    total_expense: expenseLogs.slice(0, 7).reduce((sum, e) => sum + e.amount, 0),
    dominant_mood: 'Bahagia',
    top_category: 'Makanan',
    insight_text: `Minggu ini mood kamu cukup stabil! Pengeluaran total sekitar Rp 1.2 juta, dengan kategori Makanan yang paling tinggi.

Gue notice pas hari Rabu mood kamu Cemas, dan pengeluaran di hari itu naik 2x lipat. Kebanyakan di kategori Belanja online. Ini pola yang wajar kok, otak kita emang suka cari dopamine boost pas lagi down.

Yang keren: weekend kamu berhasil kontrol pengeluaran meski mood lagi santai! Ini menunjukkan kamu udah mulai aware sama pola kamu.

Saran untuk minggu depan: Kalau notice mood lagi turun, coba pause 15 menit sebelum checkout. Jalan-jalan bentar atau chat gue dulu 😊`,
    emotional_spending_amount: 350000,
    mood_expense_correlation: {
      moods: moodLogs.slice(0, 7),
      expenses: expenseLogs.slice(0, 7)
    }
  }

  const { error: reportError } = await supabase
    .from('weekly_reports')
    .insert(weeklyReport)

  if (reportError) {
    console.error('Error seeding weekly report:', reportError)
  } else {
    console.log('✅ Seeded weekly report')
  }

  // Seed chat history
  const chatHistory = [
    {
      user_id: user.id,
      role: 'assistant',
      content: 'Halo! Gue Boney 💚 Mau cerita apa hari ini?'
    },
    {
      user_id: user.id,
      role: 'user',
      content: 'Lagi stres kerja nih'
    },
    {
      user_id: user.id,
      role: 'assistant',
      content: 'Gue dengar kamu lagi stres ya... Kerjaannya lagi banyak atau ada masalah spesifik yang bikin berat? Cerita aja, gue dengerin kok 💚'
    }
  ]

  const { error: chatError } = await supabase
    .from('chat_history')
    .insert(chatHistory)

  if (chatError) {
    console.error('Error seeding chat history:', chatError)
  } else {
    console.log('✅ Seeded chat history')
  }

  console.log('\n🎉 Seed completed successfully!')
  console.log(`\nDemo User ID: ${user.id}`)
  console.log(`Demo User Email: ${demoUser.email}`)
}

seedDemoData().catch(console.error)
