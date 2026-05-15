'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SettingsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<{
    email: string
    name: string
    avatar_url: string | null
  } | null>(null)
  const [gmailConnected, setGmailConnected] = useState(false)
  const [disconnecting, setDisconnecting] = useState(false)

  useEffect(() => {
    // TODO: Fetch user data from Supabase
    // Check if Gmail is connected
    setTimeout(() => {
      setUser({
        email: 'demo@rasakas.app',
        name: 'Demo User',
        avatar_url: null
      })
      setGmailConnected(false) // Change based on actual data
      setLoading(false)
    }, 500)
  }, [])

  const handleConnectGmail = () => {
    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(process.env.NEXT_PUBLIC_APP_URL + '/api/auth/google')}&response_type=code&scope=${encodeURIComponent('https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/gmail.readonly')}&access_type=offline&prompt=consent`
  }

  const handleDisconnectGmail = async () => {
    if (!confirm('Yakin ingin disconnect Gmail? Auto-scan email bank akan berhenti.')) {
      return
    }

    setDisconnecting(true)
    try {
      // TODO: Call API to remove Gmail tokens
      // await fetch('/api/auth/disconnect-gmail', { method: 'POST' })
      
      setTimeout(() => {
        setGmailConnected(false)
        setDisconnecting(false)
        alert('Gmail berhasil di-disconnect')
      }, 1000)
    } catch (error) {
      console.error('Failed to disconnect Gmail:', error)
      setDisconnecting(false)
      alert('Gagal disconnect Gmail')
    }
  }

  const handleLogout = async () => {
    if (!confirm('Yakin ingin logout?')) {
      return
    }

    try {
      // TODO: Call Supabase logout
      // await supabase.auth.signOut()
      localStorage.clear()
      router.push('/')
    } catch (error) {
      console.error('Failed to logout:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bouncy">⚙️</div>
          <p className="text-[#718096] font-medium">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-6 md:p-10 relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-10 right-10 w-96 h-96 bg-gradient-mint rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob blob-shape"></div>
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-gradient-peach rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob blob-shape" style={{ animationDelay: '2s' }}></div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-10 animate-fade-in-up">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-[#718096] hover:text-[#2D3748] mb-6 transition-colors text-lg"
          >
            <span className="text-3xl">←</span>
            <span className="font-medium">Kembali</span>
          </button>
          <h1 className="text-5xl md:text-6xl font-[var(--font-outfit)] font-black text-[#2D3748] mb-3">
            Pengaturan
          </h1>
          <p className="text-xl text-[#718096] font-medium">
            Kelola akun dan koneksi kamu
          </p>
        </div>

        {/* Two Column Layout for Desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Profile Section */}
          <div className="bento-card p-8 animate-fade-in-up stagger-1 hover:rotate-0" style={{ transform: 'rotate(-0.5deg)' }}>
            <h2 className="text-2xl font-[var(--font-outfit)] font-bold text-[#2D3748] mb-6">
              Profil
            </h2>
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#FF6B9D] to-[#D4BBFF] flex items-center justify-center text-4xl text-white font-bold">
                {user?.name?.[0]?.toUpperCase() || '?'}
              </div>
              <div>
                <p className="font-bold text-[#2D3748] text-lg">{user?.name || 'User'}</p>
                <p className="text-base text-[#718096]">{user?.email}</p>
              </div>
            </div>
          </div>

          {/* About */}
          <div className="bento-card p-8 animate-fade-in-up stagger-2 hover:rotate-0" style={{ transform: 'rotate(0.5deg)' }}>
            <h2 className="text-2xl font-[var(--font-outfit)] font-bold text-[#2D3748] mb-6">
              Tentang RasaKas
            </h2>
            <div className="space-y-3 text-base text-[#718096]">
              <p><span className="font-bold text-[#2D3748]">Versi:</span> 1.0.0</p>
              <p><span className="font-bold text-[#2D3748]">Build:</span> OpenClaw Agenthon 2026</p>
              <p><span className="font-bold text-[#2D3748]">AI Model:</span> Claude Sonnet 4</p>
            </div>
            <div className="mt-5 pt-5 border-t border-[#E2E8F0]">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-[#FF6B9D] hover:underline text-base font-medium">
                GitHub Repository →
              </a>
            </div>
          </div>
        </div>

        {/* Gmail Connection */}
        <div className="bento-card p-8 mb-6 animate-fade-in-up stagger-3 hover:rotate-0" style={{ transform: 'rotate(-0.5deg)' }}>
          <h2 className="text-2xl font-[var(--font-outfit)] font-bold text-[#2D3748] mb-6">
            Koneksi Gmail
          </h2>
          
          {gmailConnected ? (
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#6BCB77]/30 to-[#B5F5EC]/30 flex items-center justify-center text-2xl">
                  ✓
                </div>
                <div>
                  <p className="font-bold text-[#2D3748]">Gmail Terhubung</p>
                  <p className="text-sm text-[#718096]">Auto-scan email bank aktif</p>
                </div>
              </div>
              
              <div className="bg-[#B5F5EC]/20 rounded-xl p-4 mb-4">
                <p className="text-sm text-[#718096] mb-2">
                  <span className="font-bold text-[#2D3748]">Scan terakhir:</span> Hari ini, 22:00 WIB
                </p>
                <p className="text-sm text-[#718096]">
                  <span className="font-bold text-[#2D3748]">Email terdeteksi:</span> 3 transaksi
                </p>
              </div>

              <button
                onClick={handleDisconnectGmail}
                disabled={disconnecting}
                className="px-6 py-3 bg-[#FF6B6B] text-white font-bold rounded-xl hover:bg-[#FF5252] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {disconnecting ? 'Memutuskan...' : 'Disconnect Gmail'}
              </button>
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FFB5D8]/30 to-[#E4C1F9]/30 flex items-center justify-center text-2xl">
                  📧
                </div>
                <div>
                  <p className="font-bold text-[#2D3748]">Gmail Belum Terhubung</p>
                  <p className="text-sm text-[#718096]">Hubungkan untuk auto-tracking pengeluaran</p>
                </div>
              </div>

              <div className="bg-[#FFF4B8]/30 rounded-xl p-4 mb-4">
                <h3 className="font-bold text-[#2D3748] mb-2 text-sm">Kenapa perlu Gmail?</h3>
                <ul className="space-y-1 text-sm text-[#718096]">
                  <li className="flex items-start gap-2">
                    <span className="text-[#6BCB77] mt-0.5">✓</span>
                    <span>Auto-scan email bank setiap malam</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#6BCB77] mt-0.5">✓</span>
                    <span>Tracking pengeluaran tanpa input manual</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#6BCB77] mt-0.5">✓</span>
                    <span>Analisis korelasi mood vs spending</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={handleConnectGmail}
                className="px-6 py-3 bg-gradient-to-r from-[#FF6B9D] to-[#D4BBFF] text-white font-bold rounded-xl hover:scale-105 transition-transform shadow-lg"
              >
                Hubungkan Gmail
              </button>
            </div>
          )}
        </div>

        {/* Notifications */}
        <div className="bento-card p-8 mb-6 animate-fade-in-up stagger-4 hover:rotate-0" style={{ transform: 'rotate(0.5deg)' }}>
          <h2 className="text-2xl font-[var(--font-outfit)] font-bold text-[#2D3748] mb-6">
            Notifikasi
          </h2>
          
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-[#2D3748] text-lg">Reminder Check-in Mood</p>
                <p className="text-base text-[#718096]">Setiap pagi jam 07.00</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-[#E2E8F0] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-[#FF6B9D] peer-checked:to-[#D4BBFF]"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-[#2D3748] text-lg">Weekly Report</p>
                <p className="text-base text-[#718096]">Setiap Senin jam 08.00</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-[#E2E8F0] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-[#FF6B9D] peer-checked:to-[#D4BBFF]"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-[#2D3748] text-lg">Boney Proactive Check-in</p>
                <p className="text-base text-[#718096]">Saat detect anomaly spending</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-[#E2E8F0] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-[#FF6B9D] peer-checked:to-[#D4BBFF]"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bento-card p-8 mb-6 animate-fade-in-up stagger-5 border-2 border-[#FF6B6B]/30 hover:rotate-0" style={{ transform: 'rotate(-0.5deg)' }}>
          <h2 className="text-2xl font-[var(--font-outfit)] font-bold text-[#FF6B6B] mb-6">
            Danger Zone
          </h2>
          <button
            onClick={handleLogout}
            className="px-8 py-4 bg-[#FF6B6B] text-white font-bold text-lg rounded-xl hover:bg-[#FF5252] transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  )
}
