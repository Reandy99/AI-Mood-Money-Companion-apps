import { patternAnalystAgent } from '@/lib/agents/pattern-analyst'

export async function runWeeklyReportForUser(userId: string) {
  return patternAnalystAgent(userId)
}
