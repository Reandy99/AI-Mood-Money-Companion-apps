import { NextRequest } from 'next/server'

/**
 * Vercel Cron sends `Authorization: Bearer <CRON_SECRET>` when CRON_SECRET is set.
 * Query `?secret=` is supported for local/manual checks (see Vercel cron docs).
 */
export function isCronRequestAuthorized(request: NextRequest, secret: string): boolean {
  const authHeader = request.headers.get('authorization')
  if (authHeader === `Bearer ${secret}`) {
    return true
  }
  const url = new URL(request.url)
  if (url.searchParams.get('secret') === secret) {
    return true
  }
  return false
}
