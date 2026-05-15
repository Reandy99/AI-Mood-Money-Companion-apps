'use client'

import { useEffect, useState } from 'react'
import { MOOD_CONFIG } from '@/lib/constants/mood'
import Link from 'next/link'

type CalendarMoodEntry = {
  logged_at: string
  mood_type: string
  mood_label: string
}

export default function CalendarPage() {
  const [loading, setLoading] = useState(true)
  const [moods, setMoods] = useState<CalendarMoodEntry[]>([])
  const [currentMonth, setCurrentMonth] = useState(new Date())

  async function loadMoods() {
    // TODO: Load from API
    // Mock data for now
    setTimeout(() => {
      const mockMoods: CalendarMoodEntry[] = []
      for (let i = 0; i < 30; i++) {
        const date = new Date()
        date.setDate(date.getDate() - i)
        const moodTypeKeys = Object.keys(MOOD_CONFIG) as (keyof typeof MOOD_CONFIG)[]
        const randomMood = moodTypeKeys[Math.floor(Math.random() * moodTypeKeys.length)]

        mockMoods.push({
          logged_at: date.toISOString().split('T')[0],
          mood_type: randomMood,
          mood_label: MOOD_CONFIG[randomMood].label,
        })
      }
      setMoods(mockMoods)
      setLoading(false)
    }, 500)
  }

  useEffect(() => {
    void loadMoods()
  }, [currentMonth])

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    return { daysInMonth, startingDayOfWeek, year, month }
  }

  const getMoodForDate = (dateStr: string) => {
    return moods.find(m => m.logged_at === dateStr)
  }

  const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentMonth)
  const monthName = currentMonth.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })

  const days = []
  
  // Empty cells for days before month starts
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(<div key={`empty-${i}`} className="aspect-square" />)
  }

  // Days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    const mood = getMoodForDate(dateStr)
    const isToday = dateStr === new Date().toISOString().split('T')[0]
    
    days.push(
      <div
        key={day}
        className={`
          aspect-square neo-card p-3 md:p-4 flex flex-col items-center justify-center
          transition-all hover:scale-105 cursor-pointer
          ${isToday ? 'ring-4 ring-[#FF6B9D]' : ''}
        `}
        style={{
          backgroundColor: mood ? `${MOOD_CONFIG[mood.mood_type as keyof typeof MOOD_CONFIG].color}40` : 'var(--neo-bg)'
        }}
      >
        <div className="text-sm md:text-base font-bold text-[#6B7280] mb-1">{day}</div>
        {mood && (
          <div className="text-3xl md:text-4xl">
            {MOOD_CONFIG[mood.mood_type as keyof typeof MOOD_CONFIG].emoji}
          </div>
        )}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="neo-spinner mx-auto mb-4"></div>
          <p className="text-[#6B7280] font-medium">Loading calendar...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-6 md:p-10 relative overflow-hidden pb-24 md:pb-10">
      {/* Decorative Background */}
      <div className="decorative-circle bg-gradient-mint" style={{ top: '10%', right: '10%' }}></div>
      <div className="decorative-circle bg-gradient-pink" style={{ bottom: '20%', left: '5%' }}></div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-10 animate-fade-in-up">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-[#6B7280] hover:text-[#1F2937] mb-6 font-semibold text-lg transition-colors">
            <span className="text-2xl">←</span>
            <span>Kembali</span>
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-5xl md:text-6xl font-[var(--font-outfit)] font-black text-[#1F2937] mb-3">
                Mood Calendar 📅
              </h1>
              <p className="text-xl text-[#6B7280] font-medium">
                {monthName}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  const newDate = new Date(currentMonth)
                  newDate.setMonth(newDate.getMonth() - 1)
                  setCurrentMonth(newDate)
                }}
                className="neo-btn w-14 h-14 flex items-center justify-center text-2xl"
              >
                ←
              </button>
              <button
                onClick={() => {
                  const newDate = new Date(currentMonth)
                  newDate.setMonth(newDate.getMonth() + 1)
                  setCurrentMonth(newDate)
                }}
                className="neo-btn w-14 h-14 flex items-center justify-center text-2xl"
              >
                →
              </button>
            </div>
          </div>
        </div>

        {/* Calendar */}
        <div className="neo-card p-8 mb-8 animate-fade-in-up stagger-1">
          {/* Day headers */}
          <div className="grid grid-cols-7 gap-3 md:gap-4 mb-6">
            {['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'].map(day => (
              <div key={day} className="text-center font-bold text-[#6B7280] text-base md:text-lg">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-3 md:gap-4">
            {days}
          </div>
        </div>

        {/* Legend */}
        <div className="neo-card p-8 animate-fade-in-up stagger-2">
          <h2 className="text-2xl font-[var(--font-outfit)] font-bold text-[#1F2937] mb-6">
            Mood Legend
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(MOOD_CONFIG).map(([type, config]) => (
              <div
                key={type}
                className="flex items-center gap-3 p-4 rounded-2xl neo-card"
                style={{ backgroundColor: `${config.color}30` }}
              >
                <span className="text-3xl">{config.emoji}</span>
                <span className="text-base font-semibold text-[#1F2937]">{config.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
