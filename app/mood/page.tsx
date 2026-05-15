'use client'

import { useState } from 'react'
import { MOOD_CONFIG, MoodType } from '@/lib/constants/mood'

export default function MoodCheckInPage() {
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null)
  const [note, setNote] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!selectedMood) return
    
    setIsSubmitting(true)
    
    // TODO: API call to save mood
    console.log('Submitting mood:', { selectedMood, note })
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Redirect to dashboard
    window.location.href = '/dashboard'
  }

  return (
    <div className="min-h-screen p-6 md:p-10 relative overflow-hidden pb-24 md:pb-10">
      {/* Decorative Background Elements */}
      <div className="decorative-circle bg-gradient-pink" style={{ top: '10%', right: '5%' }}></div>
      <div className="decorative-circle bg-gradient-mint" style={{ bottom: '15%', left: '8%' }}></div>
      <div className="decorative-circle bg-gradient-peach" style={{ top: '50%', right: '15%' }}></div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in-up">
          <div className="inline-block mb-6">
            <div className="text-8xl animate-bouncy">💚</div>
          </div>
          <h1 className="text-5xl md:text-6xl font-[var(--font-outfit)] font-black text-[#1F2937] mb-4">
            Gimana Rasamu Hari Ini?
          </h1>
          <p className="text-xl text-[#6B7280] font-medium">
            Pilih mood yang paling menggambarkan perasaan kamu sekarang
          </p>
        </div>

        {/* Mood Grid - 4 columns on Desktop */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          {Object.entries(MOOD_CONFIG).map(([key, config], index) => {
            const isSelected = selectedMood === key
            return (
              <div
                key={key}
                onClick={() => setSelectedMood(key as MoodType)}
                className={`mood-card ${isSelected ? 'mood-card-selected' : ''} animate-fade-in-up cursor-pointer relative`}
                style={{ 
                  animationDelay: `${index * 0.1}s`,
                  background: isSelected ? config.color + '40' : 'var(--neo-bg)'
                }}
              >
                {/* Cute Blob Character */}
                <div 
                  className="blob-character mx-auto mb-4"
                  style={{ 
                    background: config.color + '30',
                    animationDelay: `${index * 0.2}s`
                  }}
                >
                  <span className="text-5xl md:text-6xl">{config.emoji}</span>
                </div>

                {/* Mood Label */}
                <h3 className="text-center font-bold text-[#1F2937] text-xl mb-2">
                  {config.label}
                </h3>

                {/* Mood Score Indicator */}
                <div className="flex justify-center gap-1.5">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="w-2.5 h-2.5 rounded-full"
                      style={{
                        background: i < Math.ceil(config.score / 3) ? config.color : '#D1D5DB'
                      }}
                    />
                  ))}
                </div>

                {/* Selection Indicator */}
                {isSelected && (
                  <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gradient-pink flex items-center justify-center animate-pulse-soft">
                    <span className="text-white text-sm font-bold">✓</span>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Optional Note - Neomorphic Input */}
        {selectedMood && (
          <div className="max-w-3xl mx-auto">
            <div className="neo-card p-8 mb-8 animate-fade-in-up">
              <label className="block text-base font-bold text-[#1F2937] mb-4">
                Mau cerita lebih? (opsional)
              </label>
              <div className="neo-card-inset p-5">
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value.slice(0, 100))}
                  placeholder="Tulis catatan singkat tentang perasaan kamu..."
                  maxLength={100}
                  rows={4}
                  className="w-full bg-transparent border-none outline-none text-[#1F2937] placeholder-[#9CA3AF] resize-none text-base"
                />
              </div>
              <div className="text-right text-sm text-[#9CA3AF] mt-3">
                {note.length}/100 karakter
              </div>
            </div>

            {/* Submit Button - Neomorphic */}
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="neo-btn-primary w-full py-6 text-xl font-bold animate-fade-in-up disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-3">
                  <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                  Menyimpan...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-3">
                  <span>Simpan Mood</span>
                  <span className="text-3xl">✨</span>
                </span>
              )}
            </button>

            {/* Info Card */}
            <div className="neo-card p-6 mt-6 animate-fade-in-up stagger-4">
              <div className="flex items-start gap-4">
                <div className="text-4xl">💡</div>
                <div>
                  <p className="text-base text-[#6B7280] leading-relaxed">
                    <span className="font-bold text-[#1F2937]">Tips:</span> Check-in mood setiap hari membantu kamu lebih aware dengan pola emosi. Kamu bisa edit mood hingga 2x per hari.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
