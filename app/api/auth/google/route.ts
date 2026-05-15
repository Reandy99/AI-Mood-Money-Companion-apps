import { NextRequest, NextResponse } from 'next/server'
import { google } from 'googleapis'
import { createServiceClient } from '@/lib/supabase/service'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')

    if (!code) {
      // Redirect to Google OAuth
      const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_REDIRECT_URI
      )

      const scopes = [
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/gmail.readonly'
      ]

      const authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes,
        prompt: 'consent'
      })

      return NextResponse.redirect(authUrl)
    }

    // Exchange code for tokens
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    )

    const { tokens } = await oauth2Client.getToken(code)
    oauth2Client.setCredentials(tokens)

    // Get user info
    const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client })
    const { data: userInfo } = await oauth2.userinfo.get()

    // Save to Supabase
    const supabase = createServiceClient()
    
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('email', userInfo.email!)
      .single()

    let userId: string

    if (existingUser) {
      // Update tokens
      const { data } = await supabase
        .from('users')
        .update({
          gmail_token: tokens.access_token,
          gmail_refresh_token: tokens.refresh_token,
          gmail_connected_at: new Date().toISOString(),
          name: userInfo.name,
          avatar_url: userInfo.picture
        })
        .eq('id', existingUser.id)
        .select()
        .single()

      userId = data!.id
    } else {
      // Create new user
      const { data } = await supabase
        .from('users')
        .insert({
          email: userInfo.email!,
          name: userInfo.name,
          avatar_url: userInfo.picture,
          gmail_token: tokens.access_token,
          gmail_refresh_token: tokens.refresh_token,
          gmail_connected_at: new Date().toISOString(),
          onboarded_at: new Date().toISOString()
        })
        .select()
        .single()

      userId = data!.id
    }

    // Redirect to dashboard with user_id
    const redirectUrl = new URL('/dashboard', process.env.NEXT_PUBLIC_APP_URL)
    redirectUrl.searchParams.set('user_id', userId)
    
    return NextResponse.redirect(redirectUrl.toString())
  } catch (error) {
    console.error('Error in Google OAuth:', error)
    return NextResponse.json(
      { error: 'Authentication failed', details: String(error) },
      { status: 500 }
    )
  }
}
