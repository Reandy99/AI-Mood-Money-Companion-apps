'use client'

import { useState, useEffect, useRef } from 'react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  created_at: string
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingHistory, setIsLoadingHistory] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Mock user_id for now
  const userId = 'demo-user-123'

  async function loadChatHistory() {
    try {
      // TODO: Load from API
      // For now, use mock data
      setMessages([
        {
          id: '1',
          role: 'assistant',
          content: 'Halo! Gue Boney 💚 Mau cerita apa hari ini?',
          created_at: new Date().toISOString(),
        },
      ])
      setIsLoadingHistory(false)
    } catch (error) {
      console.error('Error loading chat history:', error)
      setIsLoadingHistory(false)
    }
  }

  function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    void loadChatHistory()
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput('')
    setIsLoading(true)

    // Add user message
    const newUserMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: userMessage,
      created_at: new Date().toISOString()
    }
    setMessages(prev => [...prev, newUserMessage])

    try {
      // Call streaming API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          user_id: userId
        })
      })

      if (!response.ok) throw new Error('Failed to send message')

      // Handle streaming response
      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let assistantMessage = ''

      const assistantMessageId = (Date.now() + 1).toString()
      setMessages(prev => [...prev, {
        id: assistantMessageId,
        role: 'assistant',
        content: '',
        created_at: new Date().toISOString()
      }])

      while (reader) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        assistantMessage += chunk

        // Update assistant message
        setMessages(prev => prev.map(msg => 
          msg.id === assistantMessageId 
            ? { ...msg, content: assistantMessage }
            : msg
        ))
      }

      setIsLoading(false)
    } catch (error) {
      console.error('Error sending message:', error)
      setIsLoading(false)
      
      // Add error message
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Maaf, ada error nih. Coba lagi ya!',
        created_at: new Date().toISOString()
      }])
    }
  }

  if (isLoadingHistory) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bouncy">💬</div>
          <p className="text-[#718096] font-medium">Loading chat...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Background */}
      <div className="absolute top-10 right-10 w-96 h-96 bg-gradient-pink rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob blob-shape"></div>
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-gradient-lavender rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob blob-shape" style={{ animationDelay: '2s' }}></div>

      {/* Header */}
      <div className="relative z-10 p-4 md:p-6 border-b-2 border-white/30 backdrop-blur-sm bg-white/50">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <a href="/dashboard" className="text-3xl hover:scale-110 transition-transform">
            ←
          </a>
          <div className="flex items-center gap-3">
            <div className="text-4xl animate-bouncy">💬</div>
            <div>
              <h1 className="text-2xl font-[var(--font-outfit)] font-black text-[#2D3748]">
                Chat dengan Boney
              </h1>
              <p className="text-sm text-[#718096] font-medium">
                AI companion yang memahami kamu
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 relative z-10">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map((message, index) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-up`}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div
                className={`
                  max-w-[80%] md:max-w-[70%] p-4 rounded-3xl
                  ${message.role === 'user' 
                    ? 'bg-gradient-to-br from-[#FFB5D8]/80 to-[#E4C1F9]/80 ml-auto' 
                    : 'bento-card bg-white/80'
                  }
                `}
              >
                {message.role === 'assistant' && (
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">💚</span>
                    <span className="font-[var(--font-outfit)] font-bold text-[#2D3748] text-sm">
                      Boney
                    </span>
                  </div>
                )}
                <p className="text-[#2D3748] leading-relaxed whitespace-pre-wrap">
                  {message.content}
                </p>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start animate-fade-in-up">
              <div className="bento-card bg-white/80 p-4 rounded-3xl">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#FFB5D8] rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-[#D4BBFF] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-[#B5F5EC] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="relative z-10 p-4 md:p-6 border-t-2 border-white/30 backdrop-blur-sm bg-white/50">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ketik pesan kamu..."
              disabled={isLoading}
              className="flex-1 p-4 rounded-2xl border-2 border-[#E0E7FF] focus:border-[#D4BBFF] focus:outline-none bg-white/80 text-[#2D3748] font-medium disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="btn-pastel px-8 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="font-black">Kirim</span>
            </button>
          </form>
          
          {/* Quick replies */}
          <div className="flex gap-2 mt-3 flex-wrap">
            <button
              onClick={() => setInput('Lagi stres kerja nih')}
              disabled={isLoading}
              className="text-sm px-4 py-2 rounded-full bg-white/60 hover:bg-white/80 text-[#718096] font-medium transition-colors disabled:opacity-50"
            >
              Lagi stres kerja
            </button>
            <button
              onClick={() => setInput('Masalah keuangan')}
              disabled={isLoading}
              className="text-sm px-4 py-2 rounded-full bg-white/60 hover:bg-white/80 text-[#718096] font-medium transition-colors disabled:opacity-50"
            >
              Masalah keuangan
            </button>
            <button
              onClick={() => setInput('Cerita aja')}
              disabled={isLoading}
              className="text-sm px-4 py-2 rounded-full bg-white/60 hover:bg-white/80 text-[#718096] font-medium transition-colors disabled:opacity-50"
            >
              Cerita aja
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
