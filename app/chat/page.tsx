'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  created_at: string
  boney_mode?: 'listen' | 'humor' | 'solution'
  rag_used?: boolean
}

const MODE_LABEL: Record<string, { label: string; emoji: string; color: string }> = {
  listen:   { label: 'Dengerin', emoji: '👂', color: '#7c3aed' },
  humor:    { label: 'Humor',    emoji: '😄', color: '#f59e0b' },
  solution: { label: 'Solusi',   emoji: '💡', color: '#10b981' },
}

const QUICK_REPLIES = [
  'Lagi stres kerja nih 😮‍💨',
  'Curhat soal keuangan',
  'Gimana pola belanjaku?',
]

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingHistory, setIsLoadingHistory] = useState(true)
  const [activeMode, setActiveMode] = useState<string>('listen')
  const [ragActive, setRagActive] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const userId = 'demo-user-123'

  useEffect(() => {
    setTimeout(() => {
      setMessages([{
        id: '1',
        role: 'assistant',
        content: 'Halo! Gue Boney 💚\nMau cerita apa hari ini?',
        created_at: new Date().toISOString(),
        boney_mode: 'listen',
      }])
      setIsLoadingHistory(false)
    }, 400)
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSubmit = async (e: React.FormEvent | null, override?: string) => {
    e?.preventDefault()
    const text = (override ?? input).trim()
    if (!text || isLoading) return

    setInput('')
    setIsLoading(true)

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      created_at: new Date().toISOString(),
    }
    setMessages(prev => [...prev, userMsg])

    // Simulate RAG trigger
    setRagActive(Math.random() > 0.5)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, user_id: userId }),
      })

      if (!response.ok) throw new Error('Failed')

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let accumulated = ''
      const assistantId = (Date.now() + 1).toString()

      setMessages(prev => [...prev, {
        id: assistantId, role: 'assistant', content: '',
        created_at: new Date().toISOString(), boney_mode: 'listen',
      }])

      while (reader) {
        const { done, value } = await reader.read()
        if (done) break
        accumulated += decoder.decode(value)
        setMessages(prev => prev.map(m =>
          m.id === assistantId ? { ...m, content: accumulated } : m
        ))
      }

      setActiveMode('listen')
      setRagActive(false)
    } catch {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Maaf, ada error nih. Coba lagi ya!',
        created_at: new Date().toISOString(),
      }])
    } finally {
      setIsLoading(false)
      setRagActive(false)
      inputRef.current?.focus()
    }
  }

  if (isLoadingHistory) {
    return (
      <div className="h-screen flex items-center justify-center" style={{ background: 'var(--rk-page)' }}>
        <div className="text-center">
          <div className="text-5xl mb-3 animate-bouncy">💚</div>
          <p className="text-rk-muted font-medium text-sm">Memuat chat...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-[calc(100dvh-76px)] md:h-screen" style={{ background: 'var(--rk-page)' }}>

      {/* Header */}
      <div className="flex-shrink-0 bg-white/90 backdrop-blur-xl border-b border-[var(--rk-border-soft)] px-4 py-3 flex items-center gap-3 z-10">
        <Link href="/dashboard" className="w-9 h-9 rounded-xl bg-[var(--rk-page)] flex items-center justify-center text-rk-muted hover:text-rk-ink transition-colors flex-shrink-0">
          ←
        </Link>
        <div className="w-10 h-10 rounded-2xl bg-gradient-hero flex items-center justify-center text-xl flex-shrink-0 shadow-md" style={{ background: 'linear-gradient(135deg, #f43f5e, #7c3aed)' }}>
          💚
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-[var(--font-outfit)] font-extrabold text-rk-ink text-base leading-tight">Boney</p>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
            <p className="text-xs text-rk-subtle font-medium">Online sekarang</p>
          </div>
        </div>
        {/* Mode badge */}
        {activeMode && MODE_LABEL[activeMode] && (
          <div className="flex-shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-full text-white text-xs font-bold"
            style={{ background: MODE_LABEL[activeMode].color }}>
            <span>{MODE_LABEL[activeMode].emoji}</span>
            <span>{MODE_LABEL[activeMode].label}</span>
          </div>
        )}
      </div>

      {/* RAG indicator */}
      {ragActive && (
        <div className="flex-shrink-0 bg-[#ede9fe] px-4 py-2 flex items-center gap-2 text-xs font-bold text-[#7c3aed] z-10">
          <div className="w-1.5 h-1.5 rounded-full bg-[#7c3aed] animate-pulse" />
          Boney sedang mengambil referensi dari internet...
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.map((msg, i) => (
          <div key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-up`}
            style={{ animationDelay: `${i * 0.03}s` }}>
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#f43f5e] to-[#7c3aed] flex items-center justify-center text-sm mr-2 flex-shrink-0 mt-auto mb-0.5 shadow-sm">
                💚
              </div>
            )}
            <div className={`max-w-[78%] rounded-2xl px-4 py-3 ${
              msg.role === 'user'
                ? 'rounded-tr-sm text-white'
                : 'rounded-tl-sm bg-white shadow-rk-card text-rk-ink'
            }`}
              style={msg.role === 'user' ? { background: 'linear-gradient(135deg, #f43f5e, #fb923c)' } : {}}>
              {msg.role === 'assistant' && msg.boney_mode && (
                <div className="flex items-center gap-1 mb-1.5">
                  <span className="text-[10px] font-bold text-rk-subtle uppercase tracking-wide">
                    {MODE_LABEL[msg.boney_mode]?.emoji} {MODE_LABEL[msg.boney_mode]?.label}
                  </span>
                  {msg.rag_used && (
                    <span className="text-[10px] font-bold text-[#7c3aed] bg-[#ede9fe] px-1.5 py-0.5 rounded-full">
                      RAG
                    </span>
                  )}
                </div>
              )}
              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                {msg.content || <span className="opacity-40">...</span>}
              </p>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start animate-fade-in-up">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#f43f5e] to-[#7c3aed] flex items-center justify-center text-sm mr-2 flex-shrink-0 shadow-sm">
              💚
            </div>
            <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-rk-card">
              <div className="flex items-center gap-1.5">
                {[0, 1, 2].map(i => (
                  <div key={i} className="w-2 h-2 rounded-full bg-[var(--rk-subtle)] animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick replies */}
      {messages.length <= 1 && (
        <div className="flex-shrink-0 px-4 pb-2 flex gap-2 overflow-x-auto">
          {QUICK_REPLIES.map(q => (
            <button key={q} onClick={() => handleSubmit(null, q)} disabled={isLoading}
              className="flex-shrink-0 text-xs font-semibold px-3 py-2 bg-white rounded-full shadow-rk-card text-rk-muted hover:text-rk-ink transition-colors border border-[var(--rk-border-soft)] whitespace-nowrap disabled:opacity-50">
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Input — stays above mobile nav */}
      <div className="flex-shrink-0 bg-white/90 backdrop-blur-xl border-t border-[var(--rk-border-soft)] px-4 pt-3 pb-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ketik pesan kamu..."
            disabled={isLoading}
            className="flex-1 bg-[var(--rk-page)] rounded-2xl px-4 py-3 text-sm text-rk-ink placeholder-rk-subtle border border-[var(--rk-border-soft)] outline-none focus:border-[var(--rk-coral-1)] transition-colors disabled:opacity-50 min-w-0"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="flex-shrink-0 w-11 h-11 rounded-2xl flex items-center justify-center text-white font-bold disabled:opacity-40 transition-all active:scale-95"
            style={{ background: 'linear-gradient(135deg, #f43f5e, #fb923c)', boxShadow: '0 4px 12px rgba(244,63,94,0.4)' }}>
            {isLoading
              ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              : <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
                </svg>
            }
          </button>
        </form>
      </div>
    </div>
  )
}
