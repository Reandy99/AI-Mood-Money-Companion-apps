import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'
import { MOOD_CONFIG } from '@/lib/constants/mood'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { mood_type, note, user_id } = body

    // Validate mood_type
    if (!mood_type || !MOOD_CONFIG[mood_type as keyof typeof MOOD_CONFIG]) {
      return NextResponse.json(
        { error: 'Invalid mood type' },
        { status: 400 }
      )
    }

    // TODO: Get user_id from session
    if (!user_id) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      )
    }

    const supabase = createServiceClient()
    const config = MOOD_CONFIG[mood_type as keyof typeof MOOD_CONFIG]
    const today = new Date().toISOString().split('T')[0]

    // Check if mood already exists for today
    const { data: existingMood } = await supabase
      .from('mood_logs')
      .select('*')
      .eq('user_id', user_id)
      .eq('logged_at', today)
      .single()

    if (existingMood) {
      // Check edit limit
      if (existingMood.edit_count >= 2) {
        return NextResponse.json(
          { error: 'Edit limit reached (max 2 edits per day)' },
          { status: 400 }
        )
      }

      // Update existing mood
      const { data, error } = await supabase
        .from('mood_logs')
        .update({
          mood_type,
          mood_score: config.score,
          mood_label: config.label,
          note: note || null,
          edit_count: existingMood.edit_count + 1,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingMood.id)
        .select()
        .single()

      if (error) throw error

      return NextResponse.json({
        success: true,
        mood_log: data,
        is_edit: true,
        edits_remaining: 2 - (existingMood.edit_count + 1)
      })
    } else {
      // Create new mood log
      const { data, error } = await supabase
        .from('mood_logs')
        .insert({
          user_id,
          mood_type,
          mood_score: config.score,
          mood_label: config.label,
          note: note || null,
          logged_at: today,
          edit_count: 0
        })
        .select()
        .single()

      if (error) throw error

      return NextResponse.json({
        success: true,
        mood_log: data,
        is_edit: false
      })
    }
  } catch (error) {
    console.error('Error saving mood:', error)
    return NextResponse.json(
      { error: 'Failed to save mood' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const user_id = searchParams.get('user_id')
    const days = parseInt(searchParams.get('days') || '7')

    if (!user_id) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 400 }
      )
    }

    const supabase = createServiceClient()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const { data, error } = await supabase
      .from('mood_logs')
      .select('*')
      .eq('user_id', user_id)
      .gte('logged_at', startDate.toISOString().split('T')[0])
      .order('logged_at', { ascending: false })

    if (error) throw error

    return NextResponse.json({
      success: true,
      moods: data
    })
  } catch (error) {
    console.error('Error fetching moods:', error)
    return NextResponse.json(
      { error: 'Failed to fetch moods' },
      { status: 500 }
    )
  }
}
