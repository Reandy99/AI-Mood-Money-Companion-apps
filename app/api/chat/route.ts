import { NextRequest } from 'next/server'
import { boneyAgent } from '@/lib/agents/boney'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, user_id } = body

    if (!message || !user_id) {
      return new Response(
        JSON.stringify({ error: 'message and user_id required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Get streaming response from Boney
    const stream = await boneyAgent(user_id, message)

    // Return as Server-Sent Events
    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })
  } catch (error) {
    console.error('Error in chat endpoint:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to process chat', details: String(error) }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
