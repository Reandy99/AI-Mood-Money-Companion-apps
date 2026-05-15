# RasaKas - Troubleshooting Guide

Common issues and solutions for development, deployment, and demo.

---

## 🔧 Development Issues

### Issue: "Module not found" errors

**Symptoms:**
```
Error: Cannot find module '@/lib/supabase/client'
```

**Solutions:**
1. Check `tsconfig.json` has correct path mapping:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

2. Restart TypeScript server in VS Code: `Cmd+Shift+P` → "TypeScript: Restart TS Server"

3. Clear Next.js cache:
```bash
rm -rf .next
npm run dev
```

---

### Issue: Environment variables not loading

**Symptoms:**
- `process.env.NEXT_PUBLIC_SUPABASE_URL` is `undefined`
- API calls fail with "missing credentials"

**Solutions:**
1. Verify `.env.local` exists in project root (not in subdirectory)

2. Check variable names start with `NEXT_PUBLIC_` for client-side access

3. Restart dev server after changing `.env.local`:
```bash
# Stop server (Ctrl+C)
npm run dev
```

4. For server-side variables, don't use `NEXT_PUBLIC_` prefix

---

### Issue: Supabase connection failed

**Symptoms:**
```
Error: Invalid Supabase URL
Error: supabase.auth.getUser() returns null
```

**Solutions:**
1. Verify credentials in `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co  # Must start with https://
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...            # Long JWT token
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...                # Different from anon key
```

2. Check Supabase project is not paused:
   - Go to [supabase.com](https://supabase.com)
   - Check project status
   - Unpause if needed

3. Verify RLS policies allow access:
```sql
-- Check policies
SELECT * FROM pg_policies WHERE tablename = 'mood_logs';

-- Temporarily disable RLS for testing (NOT for production!)
ALTER TABLE mood_logs DISABLE ROW LEVEL SECURITY;
```

4. Test connection:
```typescript
// Test in browser console
const { data, error } = await supabase.from('users').select('count')
console.log(data, error)
```

---

### Issue: Claude API errors

**Symptoms:**
```
Error: 401 Unauthorized
Error: Invalid API key
Error: Rate limit exceeded
```

**Solutions:**
1. Verify API key format:
```env
ANTHROPIC_API_KEY=sk-ant-api03-...  # Must start with sk-ant-
```

2. Check API key is active:
   - Go to [console.anthropic.com](https://console.anthropic.com)
   - Verify key exists and not revoked
   - Check usage limits

3. Test API key:
```bash
curl https://api.anthropic.com/v1/messages \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "content-type: application/json" \
  -d '{"model":"claude-sonnet-4","max_tokens":1024,"messages":[{"role":"user","content":"Hello"}]}'
```

4. Rate limit handling:
```typescript
// Add retry logic
const response = await anthropic.messages.create({
  model: 'claude-sonnet-4',
  max_tokens: 1024,
  messages: [{ role: 'user', content: prompt }]
}).catch(async (error) => {
  if (error.status === 429) {
    await new Promise(resolve => setTimeout(resolve, 1000))
    return anthropic.messages.create(...)
  }
  throw error
})
```

---

### Issue: Google OAuth not working

**Symptoms:**
- Redirect to Google but error "redirect_uri_mismatch"
- "Invalid client" error
- OAuth consent screen shows error

**Solutions:**
1. Verify redirect URI matches exactly:
```
Google Cloud Console: http://localhost:3000/api/auth/google
.env.local:           http://localhost:3000/api/auth/google
```

2. Check OAuth consent screen is configured:
   - Go to Google Cloud Console
   - APIs & Services → OAuth consent screen
   - Fill in required fields
   - Add test users (your email)

3. Verify Gmail API is enabled:
   - APIs & Services → Library
   - Search "Gmail API"
   - Should show "Manage" (not "Enable")

4. Check credentials:
```env
GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com  # Must end with .apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxx                  # Must start with GOCSPX-
```

5. Test OAuth URL manually:
```
https://accounts.google.com/o/oauth2/v2/auth?client_id=YOUR_CLIENT_ID&redirect_uri=http://localhost:3000/api/auth/google&response_type=code&scope=https://www.googleapis.com/auth/userinfo.email%20https://www.googleapis.com/auth/userinfo.profile%20https://www.googleapis.com/auth/gmail.readonly&access_type=offline&prompt=consent
```

---

### Issue: Gmail API not returning emails

**Symptoms:**
- Agent 1 runs but finds 0 emails
- Gmail query returns empty results

**Solutions:**
1. Verify Gmail has bank emails:
   - Check your Gmail inbox
   - Search: `from:noreply@klikbca.com`
   - Should return results

2. Check OAuth scopes include `gmail.readonly`:
```typescript
const scopes = [
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile',
  'https://www.googleapis.com/auth/gmail.readonly'  // Must include this
]
```

3. Test Gmail API directly:
```typescript
const gmail = google.gmail({ version: 'v1', auth: oauth2Client })
const response = await gmail.users.messages.list({
  userId: 'me',
  q: 'from:noreply@klikbca.com',
  maxResults: 10
})
console.log(response.data)
```

4. Check token is saved and valid:
```sql
SELECT gmail_token, gmail_refresh_token FROM users WHERE email = 'your@email.com';
```

---

### Issue: Seed script fails

**Symptoms:**
```
Error: Cannot find module 'tsx'
Error: User already exists
Error: Foreign key constraint violation
```

**Solutions:**
1. Install tsx:
```bash
npm install -D tsx
```

2. Clear existing data:
```sql
-- Delete in order (foreign keys)
DELETE FROM agent_logs;
DELETE FROM chat_history;
DELETE FROM weekly_reports;
DELETE FROM expense_logs;
DELETE FROM mood_logs;
DELETE FROM users;
```

3. Run seed script:
```bash
npm run seed
```

4. Verify data:
```sql
SELECT COUNT(*) FROM mood_logs;    -- Should be 30
SELECT COUNT(*) FROM expense_logs; -- Should be ~50
```

---

## 🚀 Deployment Issues

### Issue: Vercel build fails

**Symptoms:**
```
Error: Type error: Property 'X' does not exist on type 'Y'
Error: Module not found
Build failed
```

**Solutions:**
1. Test build locally:
```bash
npm run build
```

2. Fix TypeScript errors:
```bash
npx tsc --noEmit
```

3. Check all imports are correct:
```typescript
// ❌ Wrong
import { supabase } from '@/lib/supabase'

// ✅ Correct
import { createServerClient } from '@/lib/supabase/server'
```

4. Verify all dependencies are in `package.json`:
```bash
npm install
```

---

### Issue: Environment variables not working on Vercel

**Symptoms:**
- App works locally but fails on Vercel
- "Missing environment variable" errors in logs

**Solutions:**
1. Add all variables in Vercel dashboard:
   - Project Settings → Environment Variables
   - Add each variable from `.env.local`
   - Apply to Production, Preview, Development

2. Redeploy after adding variables:
   - Deployments → Latest → Redeploy

3. Check variable names are correct (case-sensitive):
```
NEXT_PUBLIC_SUPABASE_URL  ✅
next_public_supabase_url  ❌
```

4. For production, update URLs:
```env
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
GOOGLE_REDIRECT_URI=https://your-domain.vercel.app/api/auth/google
```

---

### Issue: Vercel cron jobs not running

**Symptoms:**
- Cron jobs don't trigger
- No logs in Vercel dashboard
- Agents never run automatically

**Solutions:**
1. Verify `vercel.json` is committed:
```bash
git add vercel.json
git commit -m "Add cron config"
git push
```

2. Check cron syntax:
```json
{
  "crons": [
    {
      "path": "/api/agents/scan-receipts",
      "schedule": "0 22 * * *"  // Must be valid cron expression
    }
  ]
}
```

3. Verify cron endpoints are secured:
```typescript
// In route.ts
const authHeader = request.headers.get('authorization')
if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}
```

4. Check Vercel cron logs:
   - Vercel Dashboard → Project → Cron
   - View execution logs

5. Test cron endpoint manually:
```bash
curl -X POST https://your-domain.vercel.app/api/agents/scan-receipts \
  -H "Authorization: Bearer rasakas_cron_secret_2026"
```

---

### Issue: OAuth redirect URI mismatch on production

**Symptoms:**
- OAuth works locally but fails on Vercel
- "redirect_uri_mismatch" error

**Solutions:**
1. Add production URI to Google Cloud Console:
   - APIs & Services → Credentials
   - Edit OAuth client
   - Authorized redirect URIs:
     - `http://localhost:3000/api/auth/google` (dev)
     - `https://your-domain.vercel.app/api/auth/google` (prod)

2. Update environment variable on Vercel:
```env
GOOGLE_REDIRECT_URI=https://your-domain.vercel.app/api/auth/google
```

3. Redeploy Vercel

---

## 🎥 Demo Issues

### Issue: Screen recording is laggy

**Solutions:**
1. Close unnecessary apps
2. Use lower resolution (1280x720 instead of 1920x1080)
3. Record in segments, edit together
4. Use hardware encoding if available

---

### Issue: Audio quality is poor

**Solutions:**
1. Use external microphone
2. Record in quiet room
3. Use noise cancellation software
4. Record voiceover separately, sync in editing

---

### Issue: Demo data looks unrealistic

**Solutions:**
1. Run seed script with realistic data:
```bash
npm run seed
```

2. Manually add more varied data:
```sql
-- Add diverse moods
INSERT INTO mood_logs (user_id, mood_type, mood_label, mood_score, logged_at)
VALUES 
  ('user-id', 'happy', 'Bahagia', 9, '2026-05-15'),
  ('user-id', 'anxious', 'Cemas', 2, '2026-05-14'),
  ('user-id', 'calm', 'Tenang', 7, '2026-05-13');

-- Add realistic expenses
INSERT INTO expense_logs (user_id, merchant, amount, category, expense_date)
VALUES
  ('user-id', 'Starbucks', 45000, 'Makanan', '2026-05-15'),
  ('user-id', 'Grab', 25000, 'Transport', '2026-05-15'),
  ('user-id', 'Tokopedia', 150000, 'Belanja', '2026-05-14');
```

---

### Issue: Agent logs are empty

**Solutions:**
1. Trigger agents manually:
```bash
curl -X POST http://localhost:3000/api/agents/scan-receipts \
  -H "Authorization: Bearer rasakas_cron_secret_2026"
```

2. Check agent logs table:
```sql
SELECT * FROM agent_logs ORDER BY created_at DESC;
```

3. If empty, check agent code saves logs:
```typescript
// In agent code
await supabase.from('agent_logs').insert({
  agent_name: 'receipt-scanner',
  user_id: userId,
  status: 'completed',
  input_summary: { emails_scanned: 10 },
  output_summary: { transactions_found: 3 },
  duration_ms: 1500
})
```

---

## 📱 Mobile Issues

### Issue: Bottom navigation overlaps content

**Solutions:**
1. Add padding to pages:
```css
/* In page component */
<div className="pb-20 md:pb-0">
  {/* Content */}
</div>
```

2. Check layout.tsx has padding:
```typescript
<body className="pb-20 md:pb-0">
```

---

### Issue: Touch targets too small

**Solutions:**
1. Increase button size:
```css
/* Minimum 44x44px for touch targets */
.btn {
  min-height: 44px;
  min-width: 44px;
  padding: 12px 24px;
}
```

---

## 🐛 Common Bugs

### Issue: Mood edit count not enforcing limit

**Solution:**
```typescript
// In /api/mood/route.ts
const { data: existing } = await supabase
  .from('mood_logs')
  .select('edit_count')
  .eq('user_id', user.id)
  .eq('logged_at', today)
  .single()

if (existing && existing.edit_count >= 2) {
  return NextResponse.json(
    { error: 'Edit limit reached (2x per day)' },
    { status: 400 }
  )
}
```

---

### Issue: Chat streaming not working

**Solution:**
```typescript
// Ensure proper headers
return new Response(stream, {
  headers: {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  }
})
```

---

### Issue: Date timezone issues

**Solution:**
```typescript
// Always use ISO date strings for consistency
const today = new Date().toISOString().split('T')[0] // "2026-05-15"

// For display, use locale
const displayDate = new Date(dateString).toLocaleDateString('id-ID', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric'
})
```

---

## 🆘 Emergency Fixes

### If everything breaks 30 minutes before deadline:

1. **Commit current state:**
```bash
git add .
git commit -m "Backup before emergency fix"
```

2. **Revert to last working commit:**
```bash
git log --oneline  # Find last working commit
git reset --hard <commit-hash>
```

3. **Focus on demo video:**
- Use screen recording of working version
- Explain what would work in production
- Show code and architecture

4. **Simplify submission:**
- Submit what works
- Be honest about limitations
- Highlight what's complete

---

## 📞 Getting Help

### Before Asking:
1. Check this troubleshooting guide
2. Read error message carefully
3. Google the exact error
4. Check official docs (Next.js, Supabase, Anthropic)

### When Asking:
1. Describe what you're trying to do
2. Show exact error message
3. Share relevant code snippet
4. Mention what you've already tried

### Resources:
- **Next.js Docs:** [nextjs.org/docs](https://nextjs.org/docs)
- **Supabase Docs:** [supabase.com/docs](https://supabase.com/docs)
- **Anthropic Docs:** [docs.anthropic.com](https://docs.anthropic.com)
- **Vercel Docs:** [vercel.com/docs](https://vercel.com/docs)

---

**Remember:** Stay calm, read error messages, and test incrementally! 🚀
