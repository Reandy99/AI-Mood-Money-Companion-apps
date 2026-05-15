import { GmailClient, buildBankEmailQuery } from '@/lib/gmail/client'
import { createServiceClient } from '@/lib/supabase/service'

export interface ScanResult {
  userId: string
  emailsScanned: number
  emailsProcessed: number
  errors: string[]
  duration: number
}

export async function receiptScannerAgent(userId: string, gmailToken: string, gmailRefreshToken?: string): Promise<ScanResult> {
  const startTime = Date.now()
  const supabase = createServiceClient()
  
  // Log agent start
  const { data: logData } = await supabase
    .from('agent_logs')
    .insert({
      agent_name: 'receipt-scanner',
      user_id: userId,
      status: 'started',
      input_summary: {
        user_id: userId,
        scan_date: new Date().toISOString()
      }
    })
    .select()
    .single()

  const logId = logData?.id

  try {
    // Initialize Gmail client
    const gmailClient = new GmailClient(gmailToken, gmailRefreshToken)

    // Build query for today's emails (06:00 - 22:00)
    const today = new Date()
    const startOfDay = new Date(today)
    startOfDay.setHours(6, 0, 0, 0)
    
    const endOfDay = new Date(today)
    endOfDay.setHours(22, 0, 0, 0)

    const query = buildBankEmailQuery(startOfDay, endOfDay)

    // Fetch emails
    const messages = await gmailClient.listMessages(query, 50)

    console.log(`[Receipt Scanner] Found ${messages.length} emails for user ${userId}`)

    const errors: string[] = []
    let processedCount = 0

    // Check for duplicates and pass to expense parser
    for (const message of messages) {
      try {
        // Check if email already processed
        const { data: existing } = await supabase
          .from('expense_logs')
          .select('id')
          .eq('source_email_id', message.id)
          .single()

        if (existing) {
          console.log(`[Receipt Scanner] Email ${message.id} already processed, skipping`)
          continue
        }

        // Extract email content
        const subject = gmailClient.extractSubject(message)
        const body = gmailClient.extractEmailBody(message)
        const from = gmailClient.extractFrom(message)
        const date = gmailClient.extractDate(message)

        // Pass to Agent 2 (Expense Parser)
        // We'll import this dynamically to avoid circular deps
        const { expenseParserAgent } = await import('./expense-parser')
        await expenseParserAgent(userId, {
          emailId: message.id,
          subject,
          body,
          from,
          date,
          snippet: message.snippet
        })

        processedCount++
      } catch (error) {
        console.error(`[Receipt Scanner] Error processing email ${message.id}:`, error)
        errors.push(`Email ${message.id}: ${error}`)
      }
    }

    const duration = Date.now() - startTime

    // Log agent completion
    if (logId) {
      await supabase
        .from('agent_logs')
        .update({
          status: 'completed',
          output_summary: {
            emails_scanned: messages.length,
            emails_processed: processedCount,
            errors_count: errors.length
          },
          duration_ms: duration
        })
        .eq('id', logId)
    }

    return {
      userId,
      emailsScanned: messages.length,
      emailsProcessed: processedCount,
      errors,
      duration
    }
  } catch (error) {
    console.error('[Receipt Scanner] Fatal error:', error)

    // Log agent failure
    if (logId) {
      await supabase
        .from('agent_logs')
        .update({
          status: 'failed',
          error_message: String(error),
          duration_ms: Date.now() - startTime
        })
        .eq('id', logId)
    }

    throw error
  }
}
