/**
 * Strip sensitive-looking fragments from error messages returned in JSON.
 */
export function sanitizeAgentErrorMessage(error: unknown): string {
  let raw = error instanceof Error ? error.message : String(error)
  raw = raw.replace(/sk-[a-zA-Z0-9_-]{10,}/g, '[redacted]')
  raw = raw.replace(/sk-ant-[a-zA-Z0-9_-]{10,}/g, '[redacted]')
  raw = raw.replace(/Bearer\s+\S+/gi, 'Bearer [redacted]')
  raw = raw.replace(/ya29\.[a-zA-Z0-9_-]+/g, '[redacted]')
  if (raw.length > 400) {
    raw = `${raw.slice(0, 400)}…`
  }
  return raw || 'Unknown error'
}
