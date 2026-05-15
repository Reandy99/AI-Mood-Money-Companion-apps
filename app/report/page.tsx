'use client'

import { useEffect, useState } from 'react'
import { MOOD_CONFIG } from '@/lib/constants/mood'
import Link from 'next/link'

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

const CATEGORY_COLORS: Record<string, string> = {
  Makanan: '#f43f5e', Transport: '#14b8a6', Belanja: '#7c3aed',
  Hiburan: '#fbbf24', Kesehatan: '#10b981', Langganan: '#fb923c',
  Transfer: '#60a5fa', Lainnya: '#a78bfa',
}

export default function WeeklyReportPage() {
  const [loading, setLoading] = useState(true)
  const [report, setReport] = useState<WeeklyReportView | null>(null)

  useEffect(() => {
    setTimeout(() => {
      setReport({
        week_start: '2026-05-09',
        week_end: '2026-05-15',
        total_expense: 1250000,
        dominant_mood: 'Bahagia',
        top_category: 'Makanan',
        emotional_spending_amount: 350000,
        insight_text: `Minggu ini mood kamu cukup stabil dengan dominan Bahagia! Pengeluaran total Rp 1.25 juta, dengan kategori Makanan yang paling tinggi (Rp 450k).\n\nGue notice pas hari Rabu dan Kamis mood kamu Cemas, dan pengeluaran di hari itu naik 2x lipat dari biasanya. Kebanyakan di kategori Belanja online. Ini pola yang wajar kok, otak kita emang suka cari dopamine boost pas lagi down.\n\nYang keren: weekend kamu berhasil kontrol pengeluaran meski mood lagi santai! Ini menunjukkan kamu udah mulai aware sama pola kamu.\n\nSaran untuk minggu depan: Kalau notice mood lagi turun, coba pause 15 menit sebelum checkout. Jalan-jalan bentar atau chat gue dulu. Kalau masih pengen beli, ya udah beli aja — at least kamu udah mindful 😊`,
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
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bouncy">📊</div>
          <p className="text-rk-muted font-medium">Loading report...</p>
        </div>
      </div>
    )
  }

  if (!report) {
    return (
      <div className="min-h-screen flex items-center justify-center p-5">
        <div className="text-center max-w-sm">
          <div className="text-6xl mb-4">📊</div>
          <h2 className="text-2xl font-[var(--font-outfit)] font-bold text-rk-ink mb-2">Belum Ada Report</h2>
          <p className="text-rk-muted mb-6">Report mingguan tersedia setiap Senin pagi</p>
          <Link href="/dashboard" className="btn-pastel inline-block">Kembali ke Dashboard</Link>
        </div>
      </div>
    )
  }

  const maxExpense = Math.max(...report.mood_expense_correlation.expenses.map(e => e.amount))

  return (
    <div className="min-h-screen pb-28 md:pb-10" style={{ background: 'var(--rk-page)' }}>
      <div className="max-w-2xl mx-auto px-5 pt-8">

        {/* Header */}
        <div className="mb-8 animate-fade-in-up">
          <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-rk-muted hover:text-rk-ink mb-5 font-semibold text-sm transition-colors">
            <span>←</span><span>Kembali</span>
          </Link>
          <h1 className="text-3xl font-[var(--font-outfit)] font-black text-rk-ink mb-1">Weekly Report 📊</h1>
          <p className="text-rk-muted text-sm font-medium">
            {new Date(report.week_start).toLocaleDateString('id-ID', { day: 'numeric', month: 'long' })}
            {' – '}
            {new Date(report.week_end).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>

        {/* Summary stat cards */}
        <div className="grid grid-cols-3 gap-3 mb-6 animate-fade-in-up stagger-1">
          <div className="bg-white rounded-2xl p-4 shadow-rk-card text-center">
            <p className="text-xs text-rk-subtle font-semibold uppercase tracking-wide mb-1">Total</p>
            <p className="text-lg font-[var(--font-mono)] font-black text-rk-ink leading-tight">
              Rp {(report.total_expense / 1000).toFixed(0)}k
            </p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-rk-card text-center">
            <p className="text-xs text-rk-subtle font-semibold uppercase tracking-wide mb-1">Mood</p>
            <p className="text-lg font-[var(--font-outfit)] font-black text-rk-ink leading-tight truncate">
              {report.dominant_mood}
            </p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-rk-card text-center">
            <p className="text-xs text-rk-subtle font-semibold uppercase tracking-wide mb-1">Terbesar</p>
            <p className="text-lg font-[var(--font-outfit)] font-black text-rk-ink leading-tight truncate">
              {report.top_category}
            </p>
          </div>
        </div>

        {/* Mood strip */}
        <div className="bg-white rounded-3xl p-5 shadow-rk-card mb-4 animate-fade-in-up stagger-2">
          <h2 className="font-[var(--font-outfit)] font-extrabold text-rk-ink text-base mb-4">Mood 7 Hari</h2>
          <div className="grid grid-cols-7 gap-1.5">
            {report.mood_expense_correlation.moods.map((mood, i) => {
              const moodKey = Object.entries(MOOD_CONFIG).find(([, c]) => c.label === mood.mood)?.[0]
              const config = moodKey ? MOOD_CONFIG[moodKey as keyof typeof MOOD_CONFIG] : null
              const date = new Date(mood.date)
              return (
                <div key={i} className="rounded-xl py-2 px-1 text-center"
                  style={{ background: config ? config.color + '25' : '#f5f5f5' }}>
                  <div className="text-xl mb-0.5">{config?.emoji || '😐'}</div>
                  <p className="text-[9px] font-bold text-rk-muted leading-none">
                    {date.toLocaleDateString('id-ID', { weekday: 'short' })}
                  </p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Expense bars */}
        <div className="bg-white rounded-3xl p-5 shadow-rk-card mb-4 animate-fade-in-up stagger-3">
          <h2 className="font-[var(--font-outfit)] font-extrabold text-rk-ink text-base mb-4">Pengeluaran Harian</h2>
          <div className="space-y-3">
            {report.mood_expense_correlation.expenses.map((exp, i) => {
              const pct = Math.round((exp.amount / maxExpense) * 100)
              const color = CATEGORY_COLORS[exp.category] || '#a78bfa'
              const date = new Date(exp.date)
              return (
                <div key={i}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-rk-muted">
                      {date.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric' })}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full text-white"
                        style={{ background: color }}>
                        {exp.category}
                      </span>
                      <span className="text-xs font-[var(--font-mono)] font-bold text-rk-ink">
                        Rp {(exp.amount / 1000).toFixed(0)}k
                      </span>
                    </div>
                  </div>
                  <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${pct}%`, background: color }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Emotional spending */}
        <div className="rounded-3xl p-5 mb-4 animate-fade-in-up stagger-3"
          style={{ background: 'linear-gradient(135deg, #fee2e2, #fce7f3)' }}>
          <div className="flex items-center gap-3">
            <span className="text-3xl">💸</span>
            <div>
              <p className="text-xs font-bold text-[#9f1239] uppercase tracking-wide">Emotional Spending</p>
              <p className="text-2xl font-[var(--font-mono)] font-black text-[#be123c]">
                Rp {(report.emotional_spending_amount / 1000).toFixed(0)}k
              </p>
              <p className="text-xs text-[#be123c]/70 font-medium">saat mood sedang negatif</p>
            </div>
          </div>
        </div>

        {/* AI Insight — SATU KALI */}
        <div className="bg-white rounded-3xl p-5 shadow-rk-card mb-6 animate-fade-in-up stagger-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#ede9fe] to-[#ddd6fe] flex items-center justify-center text-xl flex-shrink-0">
              💡
            </div>
            <div>
              <h2 className="font-[var(--font-outfit)] font-extrabold text-rk-ink text-base leading-tight">
                Insight dari Boney
              </h2>
              <p className="text-xs text-rk-subtle font-medium">Analisis AI pola mood & pengeluaran</p>
            </div>
          </div>
          <p className="text-rk-muted text-sm leading-relaxed whitespace-pre-line">
            {report.insight_text}
          </p>
        </div>

        {/* CTA */}
        <div className="pb-4 animate-fade-in-up stagger-5">
          <Link href="/chat"
            className="rk-btn-primary w-full flex items-center justify-center gap-2 py-4 font-black text-base rounded-2xl shadow-rk-btn-primary">
            <span>💬</span>
            <span>Chat dengan Boney</span>
          </Link>
        </div>

      </div>
    </div>
  )
}
