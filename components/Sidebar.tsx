'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Sidebar() {
  const pathname = usePathname()

  // Don't show sidebar on landing, onboarding
  if (pathname === '/' || pathname === '/onboarding') {
    return null
  }

  const navItems = [
    { href: '/dashboard', icon: '🏠', label: 'Dashboard' },
    { href: '/mood', icon: '😊', label: 'Mood Check-In' },
    { href: '/calendar', icon: '📅', label: 'Calendar' },
    { href: '/chat', icon: '💬', label: 'Chat with Boney' },
    { href: '/report', icon: '📊', label: 'Weekly Report' },
    { href: '/settings', icon: '⚙️', label: 'Settings' },
  ]

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:block fixed left-0 top-0 bottom-0 w-72 bg-[var(--neo-bg)] p-8 z-50 shadow-[8px_0_16px_rgba(163,177,198,0.6),-4px_0_12px_rgba(255,255,255,0.9)]">
        {/* Logo/Brand */}
        <div className="mb-12">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="text-5xl animate-bouncy">💚</div>
            <div>
              <h1 className="text-2xl font-[var(--font-outfit)] font-black gradient-text-pastel">
                Boney.AI
              </h1>
              <p className="text-xs text-[#6B7280] font-medium">AI Mood & Money</p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex items-center gap-4 px-5 py-4 rounded-2xl font-semibold text-base transition-all
                  ${isActive 
                    ? 'neo-card-inset text-[#1F2937] scale-95' 
                    : 'text-[#6B7280] hover:bg-white/50 hover:translate-x-1'
                  }
                `}
              >
                <span className="text-2xl">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* User Profile (Bottom) */}
        <div className="absolute bottom-8 left-8 right-8">
          <div className="neo-card p-4 flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-pink flex items-center justify-center text-white font-bold text-lg">
              D
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-[#1F2937] text-sm truncate">Demo User</p>
              <p className="text-xs text-[#6B7280] truncate">demo@boney.ai</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50">
        <div className="neo-card mx-4 mb-4 rounded-3xl">
          <div className="flex justify-around items-center h-16 px-2">
            {navItems.slice(0, 5).map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-2xl transition-all ${
                    isActive
                      ? 'neo-card-inset scale-95'
                      : 'hover:scale-110'
                  }`}
                >
                  <span className={`text-2xl ${isActive ? 'scale-110' : ''}`}>{item.icon}</span>
                  <span className={`text-xs font-medium ${isActive ? 'text-[#1F2937] font-bold' : 'text-[#6B7280]'}`}>
                    {item.label.split(' ')[0]}
                  </span>
                </Link>
              )
            })}
          </div>
        </div>
      </nav>
    </>
  )
}
