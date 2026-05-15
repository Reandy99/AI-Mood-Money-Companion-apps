# RasaKas — AI Mood & Money Companion

> AI yang tahu kamu belanja karena lapar — atau karena luka.

**OpenClaw Agenthon 2026** | RISTEK x Build Club

---

## 🎯 Problem

57% Gen Z Indonesia menyebut tekanan finansial sebagai pemicu utama masalah kesehatan mental. Tidak ada tools lokal yang menghubungkan mood harian dengan pengeluaran harian secara otomatis.

## 💡 Solution

RasaKas adalah multi-agent system yang:
1. **Track mood harian** (wajib check-in setiap pagi)
2. **Scan email bank otomatis** setiap malam jam 22.00
3. **Analisis korelasi** mood vs pengeluaran setiap minggu (Senin 08.00)
4. **Chat dengan Boney** — AI companion yang memahami konteks finansial & emosional kamu

## 🤖 Multi-Agent Architecture

### Agent 1: Receipt Scanner
- **Trigger:** Cron daily 22.00 WIB
- **Tools:** Gmail API, Supabase
- **Function:** Scan email dari bank (BCA, Mandiri, BNI, BRI, GoPay, OVO)

### Agent 2: Expense Parser
- **Trigger:** Event-driven (dipanggil Agent 1)
- **Tools:** Claude API, Supabase
- **Function:** Parse merchant, amount, category dari email

### Agent 3: Pattern Analyst
- **Trigger:** Cron weekly (Senin 08.00 WIB)
- **Tools:** Supabase, Claude API
- **Function:** Analisis korelasi mood vs pengeluaran 7 hari

### Agent 4: Boney (AI Companion)
- **Trigger:** User chat + Proactive (anomaly detection)
- **Tools:** Supabase, Claude API, Notifications
- **Function:** Context-aware conversation + proactive intervention

## 🛠️ Tech Stack

- **Frontend:** Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **Database:** Supabase (PostgreSQL)
- **AI:** Claude API (claude-sonnet-4)
- **Email:** Gmail API (OAuth 2.0)
- **Scheduler:** node-cron
- **Deployment:** Vercel

## 📦 Installation

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account ([supabase.com](https://supabase.com))
- Anthropic API key ([console.anthropic.com](https://console.anthropic.com))
- Google Cloud project with Gmail API enabled

### Step 1: Clone Repository

```bash
git clone https://github.com/[team]/OpenClaw2026_[NamaTim]_RasaKas
cd rasakas
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Setup Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the migration file:
   - Copy content from `supabase/migrations/20260515000001_initial_schema.sql`
   - Paste and execute in SQL Editor
3. Get your credentials from **Project Settings > API**:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (from Service Role section)

### Step 4: Setup Google OAuth (Gmail API)

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing one
3. Enable **Gmail API**:
   - Go to **APIs & Services > Library**
   - Search "Gmail API" and click **Enable**
4. Create OAuth 2.0 credentials:
   - Go to **APIs & Services > Credentials**
   - Click **Create Credentials > OAuth client ID**
   - Application type: **Web application**
   - Authorized redirect URIs: `http://localhost:3000/api/auth/google` (for dev)
   - For production, add: `https://your-domain.vercel.app/api/auth/google`
5. Copy your **Client ID** and **Client Secret**

### Step 5: Setup Anthropic API

1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Create an API key
3. Copy the key (starts with `sk-ant-...`)

### Step 6: Configure Environment Variables

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and fill in all values:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

# Anthropic Claude API
ANTHROPIC_API_KEY=sk-ant-...

# Gmail OAuth
GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-...
GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/google

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
CRON_SECRET=rasakas_cron_secret_2026

# Node Environment
NODE_ENV=development
```

### Step 7: Seed Demo Data (Optional)

```bash
npm run seed
```

This will create:
- Demo user
- 30 days of mood logs
- 14 days of expenses (2-5 per day)
- 1 weekly report
- Sample chat history

### Step 8: Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Step 9: Test the Flow

1. Click **"Masuk dengan Google"** on landing page
2. Complete onboarding (3 steps)
3. Check-in your mood
4. Explore dashboard, calendar, chat with Boney
5. Manually trigger agents for demo:

```bash
# Trigger receipt scanner
curl -X POST http://localhost:3000/api/agents/scan-receipts \
  -H "Authorization: Bearer rasakas_cron_secret_2026"

# Trigger weekly report
curl -X POST http://localhost:3000/api/agents/weekly-report \
  -H "Authorization: Bearer rasakas_cron_secret_2026"
```

## 🚀 Running Agents Manually (for Demo)

```bash
# Trigger receipt scanner
curl -X POST http://localhost:3000/api/agents/scan-receipts \
  -H "Authorization: Bearer rasakas_cron_secret_2026"

# Trigger weekly report
curl -X POST http://localhost:3000/api/agents/weekly-report \
  -H "Authorization: Bearer rasakas_cron_secret_2026"
```

## 🌐 Deployment to Vercel

### Step 1: Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit - RasaKas OpenClaw Agenthon 2026"
git branch -M main
git remote add origin https://github.com/[your-username]/OpenClaw2026_[NamaTim]_RasaKas
git push -u origin main
```

### Step 2: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"Add New Project"**
3. Import your GitHub repository
4. Configure project:
   - **Framework Preset:** Next.js
   - **Root Directory:** `rasakas` (if monorepo) or `.` (if standalone)
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`

### Step 3: Add Environment Variables

In Vercel project settings, add all environment variables from `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
ANTHROPIC_API_KEY
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
GOOGLE_REDIRECT_URI (update to https://your-domain.vercel.app/api/auth/google)
NEXT_PUBLIC_APP_URL (update to https://your-domain.vercel.app)
CRON_SECRET
NODE_ENV=production
```

### Step 4: Update Google OAuth Redirect URI

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Navigate to **APIs & Services > Credentials**
3. Edit your OAuth 2.0 Client ID
4. Add to **Authorized redirect URIs:**
   - `https://your-domain.vercel.app/api/auth/google`
5. Save changes

### Step 5: Setup Vercel Cron Jobs

Create `vercel.json` in project root:

```json
{
  "crons": [
    {
      "path": "/api/agents/scan-receipts",
      "schedule": "0 22 * * *"
    },
    {
      "path": "/api/agents/weekly-report",
      "schedule": "0 8 * * 1"
    }
  ]
}
```

Commit and push:

```bash
git add vercel.json
git commit -m "Add Vercel cron configuration"
git push
```

### Step 6: Verify Deployment

1. Visit your deployed URL: `https://your-domain.vercel.app`
2. Test Google OAuth login
3. Check all pages work correctly
4. Verify cron jobs in Vercel dashboard

### Troubleshooting

**OAuth Error:**
- Verify redirect URI matches exactly in Google Cloud Console
- Check `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are correct
- Ensure `NEXT_PUBLIC_APP_URL` matches your Vercel domain

**Cron Jobs Not Running:**
- Verify `CRON_SECRET` matches in environment variables
- Check Vercel cron logs in dashboard
- Ensure cron endpoints have proper authorization header

**Database Connection Issues:**
- Verify Supabase credentials are correct
- Check RLS policies allow service role access
- Ensure Supabase project is not paused

## 📊 Database Schema

- `users` — User profiles + Gmail tokens
- `mood_logs` — Daily mood check-ins (edit limit: 2x)
- `expense_logs` — Parsed transactions from email
- `weekly_reports` — AI-generated correlation analysis
- `chat_history` — Conversation with Boney
- `agent_logs` — Audit trail for autonomous agents (untuk juri)

## 🎨 Key Features

### 1. Mood Check-In (Wajib)
- 8 mood options: Bahagia, Tenang, Biasa Saja, Sedih, Cemas, Frustrasi, Kelelahan, Marah
- Edit limit: 2x per hari
- Block dashboard access kalau belum check-in

### 2. 30-Day Mood Calendar
- Visual calendar view untuk 30 hari terakhir
- Color-coded by mood type

### 3. Autonomous Email Scanner
- Scan email bank setiap malam jam 22.00
- Support: BCA, Mandiri, BNI, BRI, GoPay, OVO, DANA
- Deduplication via `source_email_id`

### 4. Weekly Correlation Report
- Generate setiap Senin jam 08.00
- Analisis: mood negatif vs pengeluaran tinggi
- AI-generated insight dalam Bahasa Indonesia

### 5. Boney AI Companion
- Context-aware: tahu mood 7 hari + spending pattern
- Proactive intervention: notifikasi kalau detect anomaly
- Safety features: red flag detection untuk self-harm

## 🎥 Demo

[Link Demo Video YouTube]

## 📄 Pitch Deck

[Link Pitch Deck PDF]

## 🏆 OpenClaw Agenthon Compliance

✅ **Tool Call Capability:** Gmail API, Supabase queries, Claude API, Notifications  
✅ **Autonomous Loop:** Cron-based (22.00 daily, Senin 08.00 weekly) + event-driven  
✅ **Multi-Agent System:** 4 agents dengan orchestration & tool usage  
✅ **Reasoning & Decision-Making:** Pattern analysis, categorization, emotional intelligence  
✅ **Bukan Chatbot Biasa:** Boney = proactive + context-aware + tool orchestration

## 📝 AI Models Used

- **claude-sonnet-4** (Anthropic) — Expense parsing, pattern analysis, Boney companion

## 👥 Team

[Nama Tim] — OpenClaw Agenthon 2026

## 📜 License

MIT

---

**Last Updated:** 2026-05-15  
**Status:** In Development
