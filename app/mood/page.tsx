'use client'

import { useState } from 'react'
import { MOOD_CONFIG, MoodType } from '@/lib/constants/mood'

const MOOD_BG: Record<string, string> = {
  happy:       'linear-gradient(135deg, #fef9c3, #fde68a)',
  calm:        'linear-gradient(135deg, #d1fae5, #a7f3d0)',
  neutral:     'linear-gradient(135deg, #ede9fe, #ddd6fe)',
  sad:         'linear-gradient(135deg, #dbeafe, #bfdbfe)',
  anxious:     'linear-gradient(135deg, #f3e8ff, #e9d5ff)',
  frustrated:  'linear-gradient(135deg, #ffedd5, #fed7aa)',
  tired:       'linear-gradient(135deg, #e0f2fe, #bae6fd)',
  angry:       'linear-gradient(135deg, #fee2e2, #fecaca)',
}

const MOOD_RING: Record<string, string> = {
  happy: '#fbbf24', calm: '#10b981', neutral: '#a855f7',
  sad: '#60a5fa', anxious: '#c084fc', frustrated: '#fb923c',
  tired: '#38bdf8', angry: '#f87171',
}

export default function MoodCheckInPage() {
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null)
  const [note, setNote] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!selectedMood) return
    setIsSubmitting(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    window.location.href = '/dashboard'
  }

  const moodEntries = Object.entries(MOOD_CONFIG)

  return (
    <div className="min-h-screen pb-28 md:pb-10 relative overflow-hidden" style={{ background: 'var(--rk-page)' }}>

      {/* Ambient glow from selected mood */}
      {selectedMood && (
        <div className="pointer-events-none fixed inset-0 transition-all duration-700 opacity-30"
          style={{
            background: `radial-gradient(ellipse 80% 60% at 50% 30%, ${MOOD_RING[selectedMood]}40, transparent 70%)`
          }} />
      )}

      <div className="max-w-4xl mx-auto px-5 pt-10 md:pt-14 relative z-10">

        {/* Header */}
        <div className="text-center mb-10 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-rk-card mb-6">
            <span className="text-sm font-bold text-rk-subtle uppercase tracking-wider">Check-in harian</span>
            <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
          </div>
          <h1 className="font-[var(--font-outfit)] font-black text-4xl md:text-5xl text-rk-ink leading-tight mb-3">
            Gimana Rasamu<br />Hari Ini?
          </h1>
          <p className="text-rk-muted font-medium">
            Pilih satu mood yang paling menggambarkan perasaan kamu sekarang
          </p>
        </div>

        {/* Mood Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {moodEntries.map(([key, config], index) => {
            const isSelected = selectedMood === key
            return (
              <button
                key={key}
                onClick={() => setSelectedMood(key as MoodType)}
                className="animate-fade-in-up relative rounded-3xl p-5 text-center transition-all duration-200 overflow-hidden cursor-pointer border-2 group"
                style={{
                  animationDelay: `${index * 0.06}s`,
                  background: MOOD_BG[key],
                  borderColor: isSelected ? MOOD_RING[key] : 'transparent',
                  transform: isSelected ? 'scale(1.03)' : 'scale(1)',
                  boxShadow: isSelected
                    ? `0 12px 32px -6px ${MOOD_RING[key]}50, 0 4px 12px -4px ${MOOD_RING[key]}30`
                    : '0 4px 12px -4px rgba(28,25,23,0.06)',
                }}
              >
                {/* Selected check */}
                {isSelected && (
                  <div className="absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center"
                    style={{ background: MOOD_RING[key] }}>
                    <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}

                {/* Emoji blob */}
                <div className="text-5xl mb-3 transition-transform duration-200 group-hover:scale-110"
                  style={{ filter: isSelected ? 'drop-shadow(0 4px 8px rgba(0,0,0,0.15))' : 'none' }}>
                  {config.emoji}
                </div>

                <p className="font-[var(--font-outfit)] font-extrabold text-rk-ink text-base leading-tight">
                  {config.label}
                </p>

                {/* Score dots */}
                <div className="flex justify-center gap-1 mt-2">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-1.5 h-1.5 rounded-full transition-all"
                      style={{
                        background: i < Math.ceil(config.score / 2)
                          ? MOOD_RING[key]
                          : 'rgba(28,25,23,0.12)'
                      }} />
                  ))}
                </div>
              </button>
            )
          })}
        </div>

        {/* Note + Submit */}
        {selectedMood && (
          <div className="animate-fade-in-up max-w-2xl mx-auto">
            <div className="bg-white rounded-3xl p-6 shadow-rk-card mb-4 border border-[var(--rk-border-soft)]">
              <label className="block text-sm font-extrabold text-rk-ink mb-3 uppercase tracking-wider">
                Mau cerita lebih? (opsional)
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value.slice(0, 100))}
                placeholder="Tulis catatan singkat tentang perasaan kamu..."
                maxLength={100}
                rows={3}
                className="w-full bg-[var(--rk-page)] rounded-2xl p-4 border border-[var(--rk-border-soft)] outline-none text-rk-ink placeholder-rk-subtle resize-none text-base focus:border-[var(--rk-coral-1)] transition-colors"
              />
              <div className="text-right text-xs text-rk-subtle mt-2 font-medium">
                {note.length}/100
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="rk-btn-primary w-full py-5 text-base font-black rounded-2xl shadow-rk-btn-primary disabled:opacity-60 disabled:pointer-events-none transition-all"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-3">
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Menyimpan...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Simpan Mood
                  <span className="text-xl">{MOOD_CONFIG[selectedMood]?.emoji}</span>
                </span>
              )}
            </button>

            <p className="text-center text-xs text-rk-subtle mt-4 font-medium">
              💡 Kamu bisa edit mood hingga 2x per hari
            </p>
          </div>
        )}

        {/* Placeholder jika belum pilih */}
        {!selectedMood && (
          <div className="text-center animate-fade-in-up stagger-4 py-4">
            <div className="inline-flex items-center gap-2 bg-white/60 rounded-full px-5 py-3 border border-[var(--rk-border-soft)]">
              <span className="text-rk-subtle text-sm font-medium">👆 Tap mood di atas untuk mulai</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
