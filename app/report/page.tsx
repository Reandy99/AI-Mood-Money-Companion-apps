'use client'

import { useEffect, useState } from 'react'
import { MOOD_CONFIG } from '@/lib/constants/mood'

type ReportMoodPoint = { date: string; mood: string; score: number }
type ReportExpensePoint = { date: string; amount: number; category: string }

type WeeklyReportView = {
  week_start: string
  week_end: string
  total_expense: number
  dominant_mood: string
  top_category: string
  emotional_spending_amount: number
  insight_text: string
  mood_expense_correlation: {
    moods: ReportMoodPoint[]
    expenses: ReportExpensePoint[]
  }
}

export default function WeeklyReportPage() {
  const [loading, setLoading] = useState(true)
  const [report, setReport] = useState<WeeklyReportView | null>(null)

  async function loadReport() {
    // TODO: Load from API
    // Mock data for now
    setTimeout(() => {
      setReport({
        week_start: '2026-05-09',
        week_end: '2026-05-15',
        total_expense: 1250000,
        dominant_mood: 'Bahagia',
        top_category: 'Makanan',
        emotional_spending_amount: 350000,
        insight_text: `Minggu ini mood kamu cukup stabil dengan dominan Bahagia! Pengeluaran total Rp 1.25 juta, dengan kategori Makanan yang paling tinggi (Rp 450k).

Gue notice pas hari Rabu dan Kamis mood kamu Cemas, dan pengeluaran di hari itu naik 2x lipat dari biasanya. Kebanyakan di kategori Belanja online. Ini pola yang wajar kok, otak kita emang suka cari dopamine boost pas lagi down.

Yang keren: weekend kamu berhasil kontrol pengeluaran meski mood lagi santai! Ini menunjukkan kamu udah mulai aware sama pola kamu.

Saran untuk minggu depan: Kalau notice mood lagi turun, coba pause 15 menit sebelum checkout. Jalan-jalan bentar atau chat gue dulu. Kalau masih pengen beli, ya udah beli aja — at least kamu udah mindful 😊`,
        mood_expense_correlation: {
          moods: [
            { date: '2026-05-09', mood: 'Tenang', score: 7 },
            { date: '2026-05-10', mood: 'Bahagia', score: 9 },
            { date: '2026-05-11', mood: 'Bahagia', score: 9 },
            { date: '2026-05-12', mood: 'Cemas', score: 2 },
            { date: '2026-05-13', mood: 'Cemas', score: 2 },
            { date: '2026-05-14', mood: 'Tenang', score: 7 },
            { date: '2026-05-15', mood: 'Bahagia', score: 9 },
          ],
          expenses: [
            { date: '2026-05-09', amount: 150000, category: 'Makanan' },
            { date: '2026-05-10', amount: 180000, category: 'Makanan' },
            { date: '2026-05-11', amount: 120000, category: 'Transport' },
            { date: '2026-05-12', amount: 320000, category: 'Belanja' },
            { date: '2026-05-13', amount: 280000, category: 'Belanja' },
            { date: '2026-05-14', amount: 100000, category: 'Makanan' },
            { date: '2026-05-15', amount: 100000, category: 'Makanan' },
          ]
        }
      })
      setLoading(false)
    }, 500)
  }

  useEffect(() => {
    void loadReport()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bouncy">📊</div>
          <p className="text-[#718096] font-medium">Loading report...</p>
        </div>
      </div>
    )
  }

  if (!report) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">📊</div>
          <h2 className="text-2xl font-[var(--font-outfit)] font-bold text-[#2D3748] mb-2">
            Belum Ada Report
          </h2>
          <p className="text-[#718096] mb-6">
            Report mingguan akan tersedia setiap Senin pagi
          </p>
          <a href="/dashboard" className="btn-pastel inline-block">
            Kembali ke Dashboard
          </a>
        </div>
      </div>
    )
  }

  const maxExpense = Math.max(
    ...report.mood_expense_correlation.expenses.map((e) => e.amount)
  )

  return (
    <div className="min-h-screen p-4 md:p-8 relative overflow-hidden">
      {/* Background */}
      <div className="absolute top-10 right-10 w-96 h-96 bg-gradient-peach rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob blob-shape"></div>
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-gradient-lavender rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob blob-shape" style={{ animationDelay: '2s' }}></div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-8 animate-fade-in-up">
          <a href="/dashboard" className="inline-flex items-center gap-2 text-[#718096] hover:text-[#2D3748] mb-4 font-medium">
            <span className="text-2xl">←</span>
            <span>Kembali</span>
          </a>
          <h1 className="text-4xl md:text-5xl font-[var(--font-outfit)] font-black text-[#2D3748] mb-2">
            Weekly Report 📊
          </h1>
          <p className="text-lg text-[#718096] font-medium">
            {new Date(report.week_start).toLocaleDateString('id-ID', { day: 'numeric', month: 'long' })} - {new Date(report.week_end).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bento-card p-6 bg-gradient-to-br from-[#FFB5D8]/30 to-[#E4C1F9]/30 animate-fade-in-up stagger-1 hover:rotate-0" style={{ transform: 'rotate(-1deg)' }}>
            <p className="text-sm text-[#718096] font-medium mb-1">Total Pengeluaran</p>
            <p className="text-4xl font-[var(--font-mono)] font-bold text-[#2D3748]">
              Rp {(report.total_expense / 1000).toFixed(0)}k
            </p>
          </div>

          <div className="bento-card p-6 bg-gradient-to-br from-[#FFF4B8]/30 to-[#FFCDB2]/30 animate-fade-in-up stagger-2 hover:rotate-0" style={{ transform: 'rotate(1deg)' }}>
            <p className="text-sm text-[#718096] font-medium mb-1">Mood Dominan</p>
            <p className="text-4xl font-[var(--font-outfit)] font-bold text-[#2D3748]">
              {report.dominant_mood}
            </p>
          </div>

          <div className="bento-card p-6 bg-gradient-to-br from-[#B5F5EC]/30 to-[#B8E0FF]/30 animate-fade-in-up stagger-3 hover:rotate-0" style={{ transform: 'rotate(-0.5deg)' }}>
            <p className="text-sm text-[#718096] font-medium mb-1">Kategori Tertinggi</p>
            <p className="text-4xl font-[var(--font-outfit)] font-bold text-[#2D3748]">
              {report.top_category}
            </p>
          </div>
        </div>

        {/* Mood Chart */}
        <div className="bento-card p-6 mb-6 animate-fade-in-up stagger-4">
          <h2 className="text-2xl font-[var(--font-outfit)] font-bold text-[#2D3748] mb-4">
            Mood 7 Hari
          </h2>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {report.mood_expense_correlation.moods.map((mood, index) => {
              const moodType = Object.entries(MOOD_CONFIG).find(
                ([, config]) => config.label === mood.mood
              )?.[0]
              const config = moodType ? MOOD_CONFIG[moodType as keyof typeof MOOD_CONFIG] : null
              const date = new Date(mood.date)
              
              return (
                <div
                  key={index}
                  className="flex-shrink-0 bento-card p-4 text-center min-w-[100px]"
                  style={{ backgroundColor: config ? `${config.color}40` : '#E0E7FF40' }}
                >
                  <div className="text-4xl mb-2">{config?.emoji || '😐'}</div>
                  <p className="text-xs text-[#718096] font-bold mb-1">
                    {date.toLocaleDateString('id-ID', { weekday: 'short' })}
                  </p>
                  <p className="text-xs text-[#718096] font-medium">
                    {mood.mood}
                  </p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Expense Chart */}
        <div className="bento-card p-6 mb-6 animate-fade-in-up stagger-5">
          <h2 className="text-2xl font-[var(--font-outfit)] font-bold text-[#2D3748] mb-4">
            Pengeluaran Harian
          </h2>
          <div className="space-y-3">
            {report.mood_expense_correlation.expenses.map((expense, index) => {
              const date = new Date(expense.date)
              const percentage = (expense.amount / maxExpense) * 100
              
              return (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-[#718096]">
                      {date.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short' })}
                    </span>
                    <span className="font-[var(--font-mono)] font-bold text-[#2D3748]">
                      Rp {(expense.amount / 1000).toFixed(0)}k
                    </span>
                  </div>
                  <div className="h-8 bg-white/50 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#FFB5D8] to-[#E4C1F9] rounded-full transition-all duration-500 flex items-center justify-end pr-3"
                      style={{ width: `${percentage}%` }}
                    >
                      <span className="text-xs font-bold text-white">
                        {expense.category}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* AI Insight */}
        <div className="bento-card p-8 bg-gradient-to-br from-[#E4C1F9]/20 to-[#D4BBFF]/20 animate-fade-in-up stagger-6 hover:rotate-0" style={{ transform: 'rotate(-0.5deg)' }}>
          <div className="flex items-start gap-4 mb-4">
            <div className="text-5xl animate-bouncy">💡</div>
            <div>
              <h2 className="text-2xl font-[var(--font-outfit)] font-black text-[#2D3748] mb-1">
                Insight dari Boney
              </h2>
              <p className="text-sm text-[#718096] font-medium">
                Analisis AI tentang pola mood & pengeluaran kamu
              </p>
            </div>
          </div>
          <div className="prose prose-lg max-w-none">
            <p className="text-[#2D3748] leading-relaxed whitespace-pre-line">
              {report.insight_text}
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-8 text-center animate-fade-in-up stagger-7">
          <a href="/chat" className="btn-pastel inline-flex items-center gap-2">
            <span className="text-2xl">💬</span>
            <span className="font-black">Chat dengan Boney</span>
          </a>
        </div>
      </div>
    </div>
  )
}
