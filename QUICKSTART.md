# RasaKas - Quick Start Guide

**Untuk Hackathon OpenClaw Agenthon 2026**

---

## 🚀 Setup Cepat (15 Menit)

### 1. Install Dependencies
```bash
cd rasakas
npm install
```

### 2. Setup Environment Variables

Copy `.env.local.example` ke `.env.local`:
```bash
cp .env.local.example .env.local
```

Isi minimal credentials ini dulu:
```env
# Supabase (WAJIB)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

# Claude API (WAJIB untuk agents)
ANTHROPIC_API_KEY=sk-ant-...

# Google OAuth (OPSIONAL untuk demo awal)
GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-...
GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/google

# App Config
NEXT_PUBLIC_APP_URL=http://localhost:3000
CRON_SECRET=rasakas_cron_secret_2026
NODE_ENV=development
```

### 3. Setup Database

1. Buka Supabase project → **SQL Editor**
2. Copy isi file `supabase/migrations/20260515000001_initial_schema.sql`
3. Paste dan **Run** di SQL Editor
4. Verify: Check **Table Editor**, harus ada 6 tables

### 4. Seed Demo Data (Opsional)

```bash
npm run seed
```

Ini akan create:
- 1 demo user
- 30 hari mood logs
- 14 hari expenses (2-5 per hari)
- 1 weekly report
- Sample chat history

### 5. Start Dev Server

```bash
npm run dev
```

Buka: http://localhost:3000

---

## 🎯 Demo Flow (Tanpa Google OAuth)

Kalau belum setup Google OAuth, kamu bisa:

1. **Skip login** untuk sementara
2. **Langsung ke pages:**
   - `/mood` - Mood check-in
   - `/dashboard` - Dashboard
   - `/calendar` - 30-day calendar
   - `/chat` - Chat dengan Boney
   - `/report` - Weekly report
   - `/settings` - Settings

3. **Test manual agent triggers:**
```bash
# Receipt Scanner
curl -X POST http://localhost:3000/api/agents/scan-receipts \
  -H "Authorization: Bearer rasakas_cron_secret_2026"

# Weekly Report
curl -X POST http://localhost:3000/api/agents/weekly-report \
  -H "Authorization: Bearer rasakas_cron_secret_2026"
```

---

## 🔧 Setup Google OAuth (Untuk Full Demo)

### Step 1: Google Cloud Console

1. Buka [console.cloud.google.com](https://console.cloud.google.com)
2. Create project baru: "RasaKas"
3. Enable **Gmail API**:
   - APIs & Services → Library
   - Search "Gmail API" → Enable

### Step 2: OAuth Credentials

1. APIs & Services → Credentials
2. Create Credentials → OAuth client ID
3. Application type: **Web application**
4. Name: "RasaKas Local Dev"
5. Authorized redirect URIs:
   - `http://localhost:3000/api/auth/google`
6. **Copy Client ID & Client Secret**

### Step 3: Update .env.local

```env
GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxx
```

### Step 4: Test Login

1. Restart dev server: `npm run dev`
2. Buka http://localhost:3000
3. Click "Masuk dengan Google"
4. Pilih akun Google
5. Allow permissions
6. Redirect ke onboarding

---

## 📊 Check Agent Logs

Setelah trigger agents, check logs di Supabase:

```sql
SELECT * FROM agent_logs ORDER BY created_at DESC LIMIT 10;
```

Atau buat simple admin page:
```typescript
// app/admin/logs/page.tsx
const { data: logs } = await supabase
  .from('agent_logs')
  .select('*')
  .order('created_at', { ascending: false })
  .limit(50)
```

---

## 🎥 Recording Demo Video

### Preparation

1. **Seed data** kalau belum: `npm run seed`
2. **Clear browser cache**
3. **Close unnecessary tabs**
4. **Test all flows** work

### Recording Tools

- **Mac:** QuickTime (Cmd+Shift+5)
- **Windows:** OBS Studio
- **Cross-platform:** Loom

### Recording Checklist

- [ ] Screen resolution: 1920x1080
- [ ] Audio: Clear, no background noise
- [ ] Duration: Max 2 minutes
- [ ] Show all 4 agents in action
- [ ] Highlight autonomous loop
- [ ] Show agent logs table

### Upload

1. Export as MP4
2. Upload to YouTube
3. Visibility: **Unlisted** (penting!)
4. Title: `OpenClaw2026_[NamaTim]_RasaKas`
5. Copy link untuk Devpost

---

## 📄 Creating Pitch Deck

### Tools

- **Figma** (recommended) - [figma.com](https://figma.com)
- **Canva** - [canva.com](https://canva.com)
- **Google Slides** - Export to PDF
- **PowerPoint** - Export to PDF

### Template

Use `PITCH_DECK.md` as outline:
1. Title & Team
2. Problem Statement
3. Solution Overview (4 agents)
4. AI Workflow & Tech Stack
5. Key Features & Future

### Export

- Format: **PDF**
- File name: `OpenClaw2026_[NamaTim]_RasaKas.pdf`
- Max 5 slides
- File size < 10MB

---

## 🚀 Deploy to Vercel

### Quick Deploy

1. Push to GitHub:
```bash
git init
git add .
git commit -m "Initial commit - RasaKas"
git branch -M main
git remote add origin https://github.com/[username]/OpenClaw2026_[NamaTim]_RasaKas
git push -u origin main
```

2. Import to Vercel:
   - [vercel.com/new](https://vercel.com/new)
   - Import GitHub repo
   - Add environment variables (copy from `.env.local`)
   - Deploy

3. Update Google OAuth:
   - Add production redirect URI: `https://your-domain.vercel.app/api/auth/google`
   - Update `GOOGLE_REDIRECT_URI` in Vercel env vars

4. Test deployment:
   - Visit your Vercel URL
   - Test login flow
   - Check all pages work

---

## ✅ Pre-Submission Checklist

**30 Minutes Before Deadline:**

- [ ] Final commit to GitHub
- [ ] Verify GitHub repo is **Public**
- [ ] README.md complete
- [ ] Demo video uploaded (YouTube Unlisted)
- [ ] Pitch deck created (PDF)
- [ ] Vercel deployment working
- [ ] Test full flow one last time
- [ ] Submit to Devpost
- [ ] **STOP coding after submission!**

---

## 🆘 Troubleshooting

### "Supabase connection failed"
- Check `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Verify Supabase project is not paused
- Check RLS policies allow access

### "Claude API error"
- Verify `ANTHROPIC_API_KEY` is correct
- Check API key has credits
- Test with simple prompt first

### "Google OAuth error"
- Verify redirect URI matches exactly
- Check `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`
- Ensure Gmail API is enabled

### "Cron jobs not running on Vercel"
- Check `vercel.json` is committed
- Verify `CRON_SECRET` matches in env vars
- Check Vercel cron logs in dashboard

### "Build failed on Vercel"
- Check TypeScript errors: `npm run build` locally
- Verify all dependencies in `package.json`
- Check environment variables are set

---

## 📞 Need Help?

- **Discord:** [OpenClaw Agenthon server]
- **Email:** [support email]
- **Documentation:** Check `README.md`, `DEMO_SCRIPT.md`, `PITCH_DECK.md`

---

**Good luck! 🚀💚**

**Remember:** Focus on showing the **autonomous multi-agent system**, not just a chatbot!
