'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Sidebar() {
  const pathname = usePathname()

  if (pathname === '/' || pathname === '/onboarding') {
    return null
  }

  const navItems = [
    { href: '/dashboard', icon: '🏠', label: 'Dashboard', color: 'var(--rk-coral-1)' },
    { href: '/mood', icon: '😊', label: 'Mood Check-In', color: 'var(--rk-sun)' },
    { href: '/calendar', icon: '📅', label: 'Kalender', color: 'var(--rk-iris-1)' },
    { href: '/chat', icon: '💬', label: 'Chat Boney', color: '#34d399' },
    { href: '/report', icon: '📊', label: 'Weekly Report', color: 'var(--rk-iris-2)' },
    { href: '/settings', icon: '⚙️', label: 'Settings', color: 'var(--rk-muted)' },
  ]

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 bottom-0 w-72 flex-col bg-white/80 backdrop-blur-xl border-r border-white/60 z-50"
        style={{ boxShadow: '4px 0 24px rgba(91, 108, 255, 0.08)' }}>

        {/* Brand */}
        <div className="px-7 pt-8 pb-6">
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-[var(--rk-coral-1)] to-[var(--rk-iris-2)] flex items-center justify-center shadow-lg flex-shrink-0 group-hover:scale-105 transition-transform duration-200">
              <span className="text-2xl">💚</span>
              <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[var(--rk-sun)] border-2 border-white animate-pulse-soft" />
            </div>
            <div>
              <h1 className="text-xl font-[var(--font-outfit)] font-black gradient-text-pastel leading-none">
                Boney.AI
              </h1>
              <p className="text-xs text-rk-subtle font-medium mt-0.5">AI Mood & Money</p>
            </div>
          </Link>
        </div>

        {/* Divider */}
        <div className="mx-7 h-px bg-gradient-to-r from-transparent via-[var(--rk-border-soft)] to-transparent mb-5" />

        {/* Nav */}
        <nav className="flex-1 px-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl font-semibold text-[15px] transition-all duration-200 group relative overflow-hidden
                  ${isActive
                    ? 'nav-active font-extrabold'
                    : 'text-rk-muted hover:bg-white hover:text-rk-ink hover:shadow-sm'
                  }`}
              >
                <span
                  className={`text-xl transition-transform duration-200 ${isActive ? '' : 'group-hover:scale-110'}`}
                >
                  {item.icon}
                </span>
                <span>{item.label}</span>
                {isActive && (
                  <span className="ml-auto w-2 h-2 rounded-full bg-[var(--rk-coral-1)] animate-pulse-soft" />
                )}
              </Link>
            )
          })}
        </nav>

        {/* User card */}
        <div className="p-5">
          <div className="rk-card p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--rk-coral-1)] to-[var(--rk-iris-2)] flex items-center justify-center text-white font-black text-base flex-shrink-0">
              D
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-rk-ink text-sm truncate">Demo User</p>
              <p className="text-xs text-rk-subtle truncate">demo@boney.ai</p>
            </div>
            <div className="w-2 h-2 rounded-full bg-[#34d399] flex-shrink-0" title="Online" />
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 px-3 pb-3">
        <div className="bg-white/90 backdrop-blur-xl border border-white/70 rounded-3xl shadow-xl"
          style={{ boxShadow: '0 -8px 32px rgba(91, 108, 255, 0.12)' }}>
          <div className="flex justify-around items-center h-16 px-2">
            {navItems.slice(0, 5).map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex flex-col items-center justify-center gap-0.5 px-3 py-2 rounded-2xl transition-all duration-200 min-w-[48px]
                    ${isActive ? 'bg-gradient-to-b from-[var(--rk-coral-1)]/10 to-[var(--rk-iris-2)]/10' : 'hover:bg-white/60'}`}
                >
                  <span className={`text-xl transition-all duration-200 ${isActive ? 'scale-110' : ''}`}>
                    {item.icon}
                  </span>
                  <span className={`text-[10px] font-semibold leading-none transition-colors duration-200
                    ${isActive ? 'text-[var(--rk-coral-1)] font-extrabold' : 'text-rk-subtle'}`}>
                    {item.label.split(' ')[0]}
                  </span>
                  {isActive && (
                    <div className="absolute bottom-2 w-1 h-1 rounded-full bg-[var(--rk-coral-1)]" />
                  )}
                </Link>
              )
            })}
          </div>
        </div>
      </nav>
    </>
  )
}
