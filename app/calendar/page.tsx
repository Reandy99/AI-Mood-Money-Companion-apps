'use client'

import { useEffect, useState } from 'react'
import { MOOD_CONFIG } from '@/lib/constants/mood'

export default function CalendarPage() {
  const [loading, setLoading] = useState(true)
  const [moods, setMoods] = useState<any[]>([])
  const [currentMonth, setCurrentMonth] = useState(new Date())

  useEffect(() => {
    loadMoods()
  }, [currentMonth])

  const loadMoods = async () => {
    // TODO: Load from API
    // Mock data for now
    setTimeout(() => {
      const mockMoods = []
      for (let i = 0; i < 30; i++) {
        const date = new Date()
        date.setDate(date.getDate() - i)
        const moodTypes = Object.keys(MOOD_CONFIG)
        const randomMood = moodTypes[Math.floor(Math.random() * moodTypes.length)]
        
        mockMoods.push({
          logged_at: date.toISOString().split('T')[0],
          mood_type: randomMood,
          mood_label: MOOD_CONFIG[randomMood as keyof typeof MOOD_CONFIG].label
        })
      }
      setMoods(mockMoods)
      setLoading(false)
    }, 500)
  }

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
          aspect-square bento-card p-2 flex flex-col items-center justify-center
          transition-all hover:scale-105 cursor-pointer
          ${isToday ? 'ring-2 ring-[#FFB5D8]' : ''}
        `}
        style={{
          backgroundColor: mood ? `${MOOD_CONFIG[mood.mood_type as keyof typeof MOOD_CONFIG].color}40` : 'rgba(255,255,255,0.5)'
        }}
      >
        <div className="text-xs font-bold text-[#718096] mb-1">{day}</div>
        {mood && (
          <div className="text-2xl">
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
          <div className="text-6xl mb-4 animate-bouncy">📅</div>
          <p className="text-[#718096] font-medium">Loading calendar...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4 md:p-8 relative overflow-hidden">
      {/* Background */}
      <div className="absolute top-10 right-10 w-96 h-96 bg-gradient-mint rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob blob-shape"></div>
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-gradient-pink rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob blob-shape" style={{ animationDelay: '2s' }}></div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-8 animate-fade-in-up">
          <a href="/dashboard" className="inline-flex items-center gap-2 text-[#718096] hover:text-[#2D3748] mb-4 font-medium">
            <span className="text-2xl">←</span>
            <span>Kembali</span>
          </a>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-[var(--font-outfit)] font-black text-[#2D3748] mb-2">
                Mood Calendar 📅
              </h1>
              <p className="text-lg text-[#718096] font-medium">
                {monthName}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  const newDate = new Date(currentMonth)
                  newDate.setMonth(newDate.getMonth() - 1)
                  setCurrentMonth(newDate)
                }}
                className="w-12 h-12 rounded-full bg-white/60 hover:bg-white/80 flex items-center justify-center text-2xl transition-colors"
              >
                ←
              </button>
              <button
                onClick={() => {
                  const newDate = new Date(currentMonth)
                  newDate.setMonth(newDate.getMonth() + 1)
                  setCurrentMonth(newDate)
                }}
                className="w-12 h-12 rounded-full bg-white/60 hover:bg-white/80 flex items-center justify-center text-2xl transition-colors"
              >
                →
              </button>
            </div>
          </div>
        </div>

        {/* Calendar */}
        <div className="bento-card p-6 mb-6 animate-fade-in-up stagger-1">
          {/* Day headers */}
          <div className="grid grid-cols-7 gap-2 mb-4">
            {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map(day => (
              <div key={day} className="text-center font-bold text-[#718096] text-sm">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-2">
            {days}
          </div>
        </div>

        {/* Legend */}
        <div className="bento-card p-6 animate-fade-in-up stagger-2">
          <h2 className="text-xl font-[var(--font-outfit)] font-bold text-[#2D3748] mb-4">
            Mood Legend
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Object.entries(MOOD_CONFIG).map(([type, config]) => (
              <div
                key={type}
                className="flex items-center gap-2 p-3 rounded-2xl"
                style={{ backgroundColor: `${config.color}30` }}
              >
                <span className="text-2xl">{config.emoji}</span>
                <span className="text-sm font-medium text-[#2D3748]">{config.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
