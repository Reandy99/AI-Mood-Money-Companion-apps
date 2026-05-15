'use client'

import { useEffect, useState } from 'react'
import { MOOD_CONFIG } from '@/lib/constants/mood'
import Link from 'next/link'

export default function DashboardPage() {
  const [loading, setLoading] = useState(true)
  const [todayMood, setTodayMood] = useState<any>(null)
  const [weeklyMoods, setWeeklyMoods] = useState<any[]>([])

  useEffect(() => {
    setTimeout(() => {
      setTodayMood({ mood_type: 'happy', mood_label: 'Bahagia', logged_at: new Date().toISOString().split('T')[0] })
      setWeeklyMoods([
        { mood_type: 'happy', logged_at: '2026-05-15' },
        { mood_type: 'calm', logged_at: '2026-05-14' },
        { mood_type: 'neutral', logged_at: '2026-05-13' },
        { mood_type: 'anxious', logged_at: '2026-05-12' },
        { mood_type: 'happy', logged_at: '2026-05-11' },
        { mood_type: 'calm', logged_at: '2026-05-10' },
        { mood_type: 'tired', logged_at: '2026-05-09' },
      ])
      setLoading(false)
    }, 400)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--rk-page)' }}>
        <div className="neo-spinner mx-auto" />
      </div>
    )
  }

  const todayConfig = MOOD_CONFIG[todayMood?.mood_type as keyof typeof MOOD_CONFIG]
  const today = new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })

  return (
    <div className="min-h-screen pb-28 md:pb-10" style={{ background: 'var(--rk-page)' }}>
      <div className="max-w-2xl mx-auto px-5 pt-7 md:pt-10 space-y-4">

        {/* Greeting */}
        <div className="animate-fade-in-up">
          <p className="text-xs font-bold text-rk-subtle uppercase tracking-widest mb-1">{today}</p>
          <h1 className="text-3xl font-[var(--font-outfit)] font-black text-rk-ink">
            Halo kamu! <span className="inline-block motion-safe:animate-float-gentle">👋</span>
          </h1>
        </div>

        {/* Today's mood hero */}
        {todayMood && (
          <div className="bg-white rounded-3xl p-5 shadow-rk-card animate-fade-in-up stagger-1 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 rounded-bl-[3rem] opacity-15"
              style={{ background: todayConfig?.color }} />
            <p className="text-xs font-bold text-rk-subtle uppercase tracking-widest mb-3">Mood Hari Ini</p>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
                style={{ background: todayConfig?.color + '25' }}>
                {todayConfig?.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-2xl font-[var(--font-outfit)] font-black text-rk-ink leading-tight">
                  {todayMood.mood_label}
                </p>
                <p className="text-xs text-rk-subtle mt-0.5">Update terakhir 09:30 WIB</p>
              </div>
              <Link href="/mood"
                className="flex-shrink-0 text-xs font-bold px-3 py-1.5 rounded-full transition-colors"
                style={{ background: todayConfig?.color + '20', color: todayConfig?.color }}>
                Edit
              </Link>
            </div>
          </div>
        )}

        {/* Stats row */}
        <div className="grid grid-cols-2 gap-3 animate-fade-in-up stagger-2">
          <div className="bg-white rounded-3xl p-4 shadow-rk-card"
            style={{ background: 'linear-gradient(135deg, #fff7ed, #fff)' }}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg mb-2"
              style={{ background: '#fbbf2420' }}>🔥</div>
            <p className="text-2xl font-[var(--font-outfit)] font-black text-rk-ink">7</p>
            <p className="text-[11px] font-bold text-rk-subtle uppercase tracking-wide mt-0.5">Hari Streak</p>
          </div>
          <div className="bg-white rounded-3xl p-4 shadow-rk-card"
            style={{ background: 'linear-gradient(135deg, #f0f9ff, #fff)' }}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg mb-2"
              style={{ background: '#7c3aed15' }}>💸</div>
            <p className="text-2xl font-[var(--font-mono)] font-black text-rk-ink">Rp 0</p>
            <p className="text-[11px] font-bold text-rk-subtle uppercase tracking-wide mt-0.5">Minggu Ini</p>
          </div>
        </div>

        {/* 7-day mood strip */}
        <div className="bg-white rounded-3xl p-5 shadow-rk-card animate-fade-in-up stagger-3">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-[var(--font-outfit)] font-extrabold text-rk-ink text-base">
              Mood 7 Hari
            </h2>
            <Link href="/calendar" className="text-xs font-bold text-rk-subtle hover:text-rk-ink transition-colors">
              Lihat semua →
            </Link>
          </div>
          <div className="grid grid-cols-7 gap-1.5">
            {weeklyMoods.map((mood, i) => {
              const config = MOOD_CONFIG[mood.mood_type as keyof typeof MOOD_CONFIG]
              const date = new Date(mood.logged_at)
              const isToday = i === 0
              return (
                <div key={i}
                  className="rounded-xl py-2 px-1 text-center transition-transform hover:scale-105"
                  style={{
                    background: config?.color + '22',
                    outline: isToday ? `2px solid ${config?.color}` : 'none',
                    outlineOffset: '1px',
                  }}>
                  <div className="text-xl mb-0.5">{config?.emoji}</div>
                  <p className="text-[9px] font-bold text-rk-muted leading-none">
                    {date.toLocaleDateString('id-ID', { weekday: 'short' })}
                  </p>
                  <p className="text-[9px] text-rk-subtle">{date.getDate()}</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Mood dominan */}
        <div className="bg-white rounded-3xl p-4 shadow-rk-card animate-fade-in-up stagger-3 flex items-center gap-4"
          style={{ background: 'linear-gradient(135deg, #f0fdf4, #fff)' }}>
          <div className="w-10 h-10 rounded-2xl bg-[#10b981]/15 flex items-center justify-center text-xl flex-shrink-0">
            😊
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-bold text-rk-subtle uppercase tracking-wide">Mood Dominan Minggu Ini</p>
            <p className="text-xl font-[var(--font-outfit)] font-black text-rk-ink">Bahagia</p>
          </div>
          <span className="text-2xl">✨</span>
        </div>

        {/* CTA cards */}
        <div className="grid grid-cols-2 gap-3 animate-fade-in-up stagger-4">
          <Link href="/chat"
            className="bg-white rounded-3xl p-5 shadow-rk-card hover:-translate-y-0.5 transition-all duration-200 group"
            style={{ background: 'linear-gradient(135deg, #fff1f2, #fff)' }}>
            <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">💬</div>
            <p className="font-[var(--font-outfit)] font-extrabold text-rk-ink text-sm mb-1">Chat Boney</p>
            <p className="text-rk-muted text-xs leading-relaxed">Curhat atau minta insight</p>
            <p className="mt-2 text-xs font-black" style={{ color: 'var(--rk-coral-1)' }}>Mulai →</p>
          </Link>

          <Link href="/report"
            className="bg-white rounded-3xl p-5 shadow-rk-card hover:-translate-y-0.5 transition-all duration-200 group"
            style={{ background: 'linear-gradient(135deg, #f5f3ff, #fff)' }}>
            <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">📊</div>
            <p className="font-[var(--font-outfit)] font-extrabold text-rk-ink text-sm mb-1">Weekly Report</p>
            <p className="text-rk-muted text-xs leading-relaxed">Korelasi mood & pengeluaran</p>
            <p className="mt-2 text-xs font-black" style={{ color: 'var(--rk-iris-1)' }}>Lihat →</p>
          </Link>
        </div>

        {/* Today's expenses placeholder */}
        <div className="bg-white rounded-3xl p-5 shadow-rk-card animate-fade-in-up stagger-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-[var(--font-outfit)] font-extrabold text-rk-ink text-base">
              Pengeluaran Hari Ini
            </h2>
            <span className="text-xs font-bold text-rk-subtle">Rp 0</span>
          </div>
          <div className="flex flex-col items-center py-6 text-center">
            <span className="text-4xl mb-2 opacity-50">🧾</span>
            <p className="text-sm text-rk-subtle font-medium">Belum ada receipt</p>
            <p className="text-xs text-rk-subtle mt-1">Agent scan email jam 22:00</p>
          </div>
        </div>

      </div>
    </div>
  )
}
