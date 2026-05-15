'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [connecting, setConnecting] = useState(false)

  const handleConnectGmail = () => {
    setConnecting(true)
    // Redirect to Google OAuth
    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(process.env.NEXT_PUBLIC_APP_URL + '/api/auth/google')}&response_type=code&scope=${encodeURIComponent('https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/gmail.readonly')}&access_type=offline&prompt=consent`
  }

  const handleSkipGmail = () => {
    // Mark onboarding as complete and go to mood check-in
    localStorage.setItem('onboarding_completed', 'true')
    router.push('/mood')
  }

  const handleComplete = () => {
    localStorage.setItem('onboarding_completed', 'true')
    router.push('/mood')
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-10 right-10 w-96 h-96 bg-gradient-mint rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob blob-shape"></div>
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-gradient-peach rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob blob-shape" style={{ animationDelay: '2s' }}></div>

      <div className="max-w-2xl w-full relative z-10">
        {/* Progress Indicator */}
        <div className="flex justify-center gap-2 mb-8">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all ${
                i === step ? 'w-12 bg-[#FF6B9D]' : 'w-2 bg-[#E2E8F0]'
              }`}
            />
          ))}
        </div>

        {/* Step 1: Welcome */}
        {step === 1 && (
          <div className="bento-card p-8 md:p-12 text-center animate-fade-in-up">
            <div className="text-7xl mb-6 animate-bouncy">💚</div>
            <h1 className="text-4xl md:text-5xl font-[var(--font-outfit)] font-black text-[#2D3748] mb-4">
              Selamat Datang di RasaKas!
            </h1>
            <p className="text-lg text-[#718096] font-medium mb-8 max-w-lg mx-auto">
              AI companion yang membantu kamu memahami hubungan antara mood dan pengeluaran harian.
            </p>
            <button
              onClick={() => setStep(2)}
              className="px-8 py-4 bg-gradient-to-r from-[#FF6B9D] to-[#D4BBFF] text-white font-bold rounded-2xl hover:scale-105 transition-transform shadow-lg"
            >
              Mulai Sekarang
            </button>
          </div>
        )}

        {/* Step 2: Connect Gmail */}
        {step === 2 && (
          <div className="bento-card p-8 md:p-12 animate-fade-in-up">
            <div className="text-6xl mb-6 text-center">📧</div>
            <h2 className="text-3xl md:text-4xl font-[var(--font-outfit)] font-black text-[#2D3748] mb-4 text-center">
              Hubungkan Gmail
            </h2>
            <p className="text-lg text-[#718096] font-medium mb-6 text-center max-w-lg mx-auto">
              Kami akan scan email dari bank kamu setiap malam untuk tracking pengeluaran otomatis.
            </p>
            
            <div className="bg-[#FFF4B8]/30 rounded-2xl p-6 mb-6">
              <h3 className="font-bold text-[#2D3748] mb-3 flex items-center gap-2">
                <span>🔒</span> Privasi & Keamanan
              </h3>
              <ul className="space-y-2 text-sm text-[#718096]">
                <li className="flex items-start gap-2">
                  <span className="text-[#6BCB77] mt-0.5">✓</span>
                  <span>Kami hanya baca email dari bank (BCA, Mandiri, BNI, BRI, GoPay, OVO, DANA)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#6BCB77] mt-0.5">✓</span>
                  <span>Token disimpan terenkripsi di database</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#6BCB77] mt-0.5">✓</span>
                  <span>Kamu bisa disconnect kapan saja di Settings</span>
                </li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleConnectGmail}
                disabled={connecting}
                className="flex-1 px-6 py-4 bg-gradient-to-r from-[#FF6B9D] to-[#D4BBFF] text-white font-bold rounded-2xl hover:scale-105 transition-transform shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {connecting ? 'Menghubungkan...' : 'Hubungkan Gmail'}
              </button>
              <button
                onClick={handleSkipGmail}
                className="px-6 py-4 bg-[#E2E8F0] text-[#718096] font-bold rounded-2xl hover:bg-[#CBD5E0] transition-colors"
              >
                Lewati Dulu
              </button>
            </div>
          </div>
        )}

        {/* Step 3: How It Works */}
        {step === 3 && (
          <div className="bento-card p-8 md:p-12 animate-fade-in-up">
            <div className="text-6xl mb-6 text-center">🤖</div>
            <h2 className="text-3xl md:text-4xl font-[var(--font-outfit)] font-black text-[#2D3748] mb-4 text-center">
              Cara Kerja RasaKas
            </h2>
            <p className="text-lg text-[#718096] font-medium mb-8 text-center max-w-lg mx-auto">
              4 AI agents bekerja otomatis untuk kamu
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-[#FFB5D8]/30 to-[#E4C1F9]/30 flex items-center justify-center text-2xl">
                  😊
                </div>
                <div>
                  <h3 className="font-bold text-[#2D3748] mb-1">1. Check-in Mood Setiap Hari</h3>
                  <p className="text-sm text-[#718096]">Tap mood kamu setiap pagi (wajib, bisa edit 2x per hari)</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-[#B5F5EC]/30 to-[#B8E0FF]/30 flex items-center justify-center text-2xl">
                  📧
                </div>
                <div>
                  <h3 className="font-bold text-[#2D3748] mb-1">2. Auto-Scan Email Bank</h3>
                  <p className="text-sm text-[#718096]">Setiap malam jam 22.00, AI scan email transaksi kamu</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-[#FFF4B8]/30 to-[#FFCDB2]/30 flex items-center justify-center text-2xl">
                  📊
                </div>
                <div>
                  <h3 className="font-bold text-[#2D3748] mb-1">3. Weekly Analysis</h3>
                  <p className="text-sm text-[#718096]">Setiap Senin jam 08.00, dapat laporan korelasi mood vs pengeluaran</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-[#E4C1F9]/30 to-[#D4BBFF]/30 flex items-center justify-center text-2xl">
                  💬
                </div>
                <div>
                  <h3 className="font-bold text-[#2D3748] mb-1">4. Chat dengan Boney</h3>
                  <p className="text-sm text-[#718096]">AI companion yang paham konteks finansial & emosional kamu</p>
                </div>
              </div>
            </div>

            <button
              onClick={handleComplete}
              className="w-full px-8 py-4 bg-gradient-to-r from-[#FF6B9D] to-[#D4BBFF] text-white font-bold rounded-2xl hover:scale-105 transition-transform shadow-lg"
            >
              Mulai Check-in Mood
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
