import cron from 'node-cron'
import { createServiceClient } from '@/lib/supabase/service'
import { receiptScannerAgent } from '@/lib/agents/receipt-scanner'
import { patternAnalystAgent } from '@/lib/agents/pattern-analyst'
import { dailySummaryAgent } from '@/lib/agents/daily-summary'

export function initializeCronJobs() {
  console.log('[Cron] Initializing scheduled jobs...')

  // Daily receipt scanner - runs at 22:00 WIB (15:00 UTC)
  cron.schedule('0 15 * * *', async () => {
    console.log('[Cron] Running daily receipt scanner...')
    
    try {
      const supabase = createServiceClient()
      
      // Get all users with Gmail connected
      const { data: users, error } = await supabase
        .from('users')
        .select('id, gmail_token, gmail_refresh_token')
        .not('gmail_token', 'is', null)

      if (error) throw error

      console.log(`[Cron] Found ${users?.length || 0} users to scan`)

      // Run scanner for each user
      for (const user of users || []) {
        try {
          await receiptScannerAgent(user.id, user.gmail_token, user.gmail_refresh_token ?? undefined)
          console.log(`[Cron] Completed scan for user ${user.id}`)
        } catch (error) {
          console.error(`[Cron] Failed to scan for user ${user.id}:`, error)
        }
      }

      console.log('[Cron] Daily receipt scanner completed')
    } catch (error) {
      console.error('[Cron] Error in daily receipt scanner:', error)
    }
  }, {
    timezone: 'Asia/Jakarta'
  })

  // Daily summary notification - runs at 22:05 WIB (15:05 UTC)
  // 5 minutes after receipt scanner to ensure all receipts are processed
  cron.schedule('5 15 * * *', async () => {
    console.log('[Cron] Running daily summary notification...')
    
    try {
      const supabase = createServiceClient()
      
      // Get all active users
      const { data: users, error } = await supabase
        .from('users')
        .select('id')
        .not('onboarded_at', 'is', null)

      if (error) throw error

      console.log(`[Cron] Found ${users?.length || 0} users for daily summary`)

      // Run daily summary for each user
      for (const user of users || []) {
        try {
          await dailySummaryAgent(user.id)
          console.log(`[Cron] Sent daily summary to user ${user.id}`)
        } catch (error) {
          console.error(`[Cron] Failed to send summary to user ${user.id}:`, error)
        }
      }

      console.log('[Cron] Daily summary notification completed')
    } catch (error) {
      console.error('[Cron] Error in daily summary notification:', error)
    }
  }, {
    timezone: 'Asia/Jakarta'
  })

  // Weekly pattern analyst - runs every Monday at 08:00 WIB (01:00 UTC)
  cron.schedule('0 1 * * 1', async () => {
    console.log('[Cron] Running weekly pattern analyst...')
    
    try {
      const supabase = createServiceClient()
      
      // Get all active users
      const { data: users, error } = await supabase
        .from('users')
        .select('id')
        .not('onboarded_at', 'is', null)

      if (error) throw error

      console.log(`[Cron] Found ${users?.length || 0} users to analyze`)

      // Run analyst for each user
      for (const user of users || []) {
        try {
          await patternAnalystAgent(user.id)
          console.log(`[Cron] Completed analysis for user ${user.id}`)
        } catch (error) {
          console.error(`[Cron] Failed to analyze for user ${user.id}:`, error)
        }
      }

      console.log('[Cron] Weekly pattern analyst completed')
    } catch (error) {
      console.error('[Cron] Error in weekly pattern analyst:', error)
    }
  }, {
    timezone: 'Asia/Jakarta'
  })

  console.log('[Cron] Scheduled jobs initialized:')
  console.log('  - Daily receipt scanner: 22:00 WIB')
  console.log('  - Daily summary notification: 22:05 WIB')
  console.log('  - Weekly pattern analyst: Monday 08:00 WIB')
}
