'use client'

import { useEffect, useState } from 'react'
import { MOOD_CONFIG } from '@/lib/constants/mood'
import Link from 'next/link'

export default function DashboardPage() {
  const [loading, setLoading] = useState(true)
  const [todayMood, setTodayMood] = useState<any>(null)
  const [weeklyMoods, setWeeklyMoods] = useState<any[]>([])

  useEffect(() => {
    // TODO: Check if user has checked in today
    // If not, redirect to /mood
    
    // Mock data for now
    setTimeout(() => {
      setTodayMood({
        mood_type: 'happy',
        mood_label: 'Bahagia',
        logged_at: new Date().toISOString().split('T')[0]
      })
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
    }, 500)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="neo-spinner mx-auto mb-4"></div>
          <p className="text-[#6B7280] font-medium">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-6 md:p-10 relative overflow-hidden pb-24 md:pb-10">
      {/* Decorative Background */}
      <div className="decorative-circle bg-gradient-pink" style={{ top: '5%', right: '10%' }}></div>
      <div className="decorative-circle bg-gradient-mint" style={{ bottom: '10%', left: '5%' }}></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-10 animate-fade-in-up">
          <h1 className="text-5xl md:text-6xl font-[var(--font-outfit)] font-black text-[#1F2937] mb-3">
            Halo! 👋
          </h1>
          <p className="text-xl text-[#6B7280] font-medium">
            {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Main Grid - Desktop Optimized */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Left Column - Today's Mood + Weekly Strip */}
          <div className="lg:col-span-2 space-y-6">
            {/* Today's Mood - Larger on Desktop */}
            {todayMood && (
              <div className="neo-card p-8 animate-fade-in-up stagger-1">
                <div className="flex items-center gap-6">
                  <div 
                    className="w-24 h-24 rounded-full flex items-center justify-center text-6xl flex-shrink-0"
                    style={{ background: MOOD_CONFIG[todayMood.mood_type as keyof typeof MOOD_CONFIG]?.color + '30' }}
                  >
                    {MOOD_CONFIG[todayMood.mood_type as keyof typeof MOOD_CONFIG]?.emoji}
                  </div>
                  <div>
                    <p className="text-base text-[#6B7280] font-medium mb-1">Mood Hari Ini</p>
                    <p className="text-4xl font-[var(--font-outfit)] font-black text-[#1F2937]">
                      {todayMood.mood_label}
                    </p>
                    <p className="text-sm text-[#9CA3AF] mt-2">Terakhir update: 09:30 WIB</p>
                  </div>
                </div>
              </div>
            )}

            {/* Weekly Mood Strip - Horizontal on Desktop */}
            <div className="neo-card p-8 animate-fade-in-up stagger-2">
              <h2 className="text-2xl font-[var(--font-outfit)] font-bold text-[#1F2937] mb-6">
                Mood 7 Hari Terakhir
              </h2>
              <div className="grid grid-cols-7 gap-4">
                {weeklyMoods.map((mood, index) => {
                  const config = MOOD_CONFIG[mood.mood_type as keyof typeof MOOD_CONFIG]
                  const date = new Date(mood.logged_at)
                  return (
                    <div
                      key={index}
                      className="neo-card p-5 text-center"
                      style={{ backgroundColor: `${config?.color}20` }}
                    >
                      <div className="text-4xl mb-3">{config?.emoji}</div>
                      <p className="text-xs text-[#6B7280] font-bold">
                        {date.toLocaleDateString('id-ID', { weekday: 'short' })}
                      </p>
                      <p className="text-xs text-[#9CA3AF] mt-1">
                        {date.getDate()}
                      </p>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Right Column - Quick Stats */}
          <div className="space-y-6">
            <div className="neo-card p-6 animate-fade-in-up stagger-3">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-14 h-14 rounded-full bg-gradient-peach flex items-center justify-center text-3xl">
                  💰
                </div>
                <p className="text-sm text-[#6B7280] font-semibold">Total Pengeluaran</p>
              </div>
              <p className="text-4xl font-[var(--font-mono)] font-bold text-[#1F2937] mb-1">
                Rp 0
              </p>
              <p className="text-xs text-[#9CA3AF]">Minggu ini</p>
            </div>

            <div className="neo-card p-6 animate-fade-in-up stagger-3">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-14 h-14 rounded-full bg-gradient-mint flex items-center justify-center text-3xl">
                  😊
                </div>
                <p className="text-sm text-[#6B7280] font-semibold">Mood Dominan</p>
              </div>
              <p className="text-4xl font-[var(--font-outfit)] font-bold text-[#1F2937] mb-1">
                Bahagia
              </p>
              <p className="text-xs text-[#9CA3AF]">7 hari terakhir</p>
            </div>

            <div className="neo-card p-6 animate-fade-in-up stagger-3">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-14 h-14 rounded-full bg-gradient-lavender flex items-center justify-center text-3xl">
                  🔥
                </div>
                <p className="text-sm text-[#6B7280] font-semibold">Streak Check-In</p>
              </div>
              <p className="text-4xl font-[var(--font-mono)] font-bold text-[#1F2937] mb-1">
                7 hari
              </p>
              <p className="text-xs text-[#9CA3AF]">Pertahankan!</p>
            </div>
          </div>
        </div>

        {/* CTA Cards - Full Width on Desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href="/chat" className="neo-card p-8 animate-fade-in-up stagger-4 hover:scale-105 transition-all cursor-pointer">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-full bg-gradient-pink flex items-center justify-center text-4xl flex-shrink-0">
                💬
              </div>
              <div>
                <h3 className="text-2xl font-[var(--font-outfit)] font-bold text-[#1F2937] mb-2">
                  Chat dengan Boney
                </h3>
                <p className="text-base text-[#6B7280] font-medium">
                  Curhat atau minta insight tentang pola pengeluaran kamu
                </p>
              </div>
            </div>
          </Link>

          <Link href="/report" className="neo-card p-8 animate-fade-in-up stagger-4 hover:scale-105 transition-all cursor-pointer">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-full bg-gradient-mint flex items-center justify-center text-4xl flex-shrink-0">
                📊
              </div>
              <div>
                <h3 className="text-2xl font-[var(--font-outfit)] font-bold text-[#1F2937] mb-2">
                  Weekly Report
                </h3>
                <p className="text-base text-[#6B7280] font-medium">
                  Analisis korelasi mood vs pengeluaran minggu ini
                </p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
