import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

/**
 * Lists all user IDs from `public.users`.
 *
 * Schema note: there is no `is_active` column in migrations. Cron jobs iterate
 * every row in `users` (minimal `id` projection). Receipt scan skips users
 * without Gmail tokens at run time.
 */
export async function fetchAllUserIdsForCron(
  supabase: SupabaseClient<Database>
): Promise<string[]> {
  const { data, error } = await supabase.from('users').select('id')

  if (error) {
    throw new Error(`Failed to list users: ${error.message}`)
  }

  return (data ?? []).map((row) => row.id)
}
