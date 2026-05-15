import { google } from 'googleapis'
import type { gmail_v1 } from 'googleapis'
import type { OAuth2Client } from 'google-auth-library'

export interface GmailMessage {
  id: string
  threadId: string
  snippet: string
  payload?: gmail_v1.Schema$MessagePart
  internalDate: string
}

export class GmailClient {
  private oauth2Client: OAuth2Client

  constructor(accessToken: string, refreshToken?: string) {
    this.oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    )

    this.oauth2Client.setCredentials({
      access_token: accessToken,
      refresh_token: refreshToken
    })
  }

  async listMessages(query: string, maxResults: number = 50): Promise<GmailMessage[]> {
    try {
      const gmail = google.gmail({ version: 'v1', auth: this.oauth2Client })

      const response = await gmail.users.messages.list({
        userId: 'me',
        q: query,
        maxResults
      })

      if (!response.data.messages) {
        return []
      }

      // Fetch full message details
      const messages = await Promise.all(
        response.data.messages.map(async (msg) => {
          const fullMessage = await gmail.users.messages.get({
            userId: 'me',
            id: msg.id!,
            format: 'full'
          })
          return fullMessage.data as GmailMessage
        })
      )

      return messages
    } catch (error) {
      console.error('Error listing Gmail messages:', error)
      throw error
    }
  }

  extractEmailBody(message: GmailMessage): string {
    try {
      const parts = message.payload?.parts || []
      
      // Try to find text/plain or text/html part
      for (const part of parts) {
        if (part.mimeType === 'text/plain' || part.mimeType === 'text/html') {
          if (part.body?.data) {
            return Buffer.from(part.body.data, 'base64').toString('utf-8')
          }
        }
      }

      // Fallback to snippet
      return message.snippet || ''
    } catch (error) {
      console.error('Error extracting email body:', error)
      return message.snippet || ''
    }
  }

  extractSubject(message: GmailMessage): string {
    const headers = message.payload?.headers || []
    const subjectHeader = headers.find(
      (h): h is gmail_v1.Schema$MessagePartHeader =>
        Boolean(h && typeof h === 'object' && 'name' in h && String(h.name).toLowerCase() === 'subject')
    )
    return subjectHeader?.value || ''
  }

  extractFrom(message: GmailMessage): string {
    const headers = message.payload?.headers || []
    const fromHeader = headers.find(
      (h): h is gmail_v1.Schema$MessagePartHeader =>
        Boolean(h && typeof h === 'object' && 'name' in h && String(h.name).toLowerCase() === 'from')
    )
    return fromHeader?.value || ''
  }

  extractDate(message: GmailMessage): Date {
    return new Date(parseInt(message.internalDate))
  }
}

// Bank email filters
export const BANK_EMAIL_FILTERS = [
  'noreply@klikbca.com',
  'no-reply@bankmandiri.co.id',
  'bni@bni.co.id',
  'customercare@bri.co.id',
  'noreply@gopay.co.id',
  'noreply@ovo.id',
  'noreply@dana.id',
  'notification@bukalapak.com',
  'noreply@tokopedia.com',
  'noreply@shopee.co.id'
]

export function buildBankEmailQuery(startDate: Date, endDate: Date): string {
  const fromFilters = BANK_EMAIL_FILTERS.map(email => `from:${email}`).join(' OR ')
  const afterDate = startDate.toISOString().split('T')[0].replace(/-/g, '/')
  const beforeDate = endDate.toISOString().split('T')[0].replace(/-/g, '/')
  
  return `(${fromFilters}) after:${afterDate} before:${beforeDate}`
}
