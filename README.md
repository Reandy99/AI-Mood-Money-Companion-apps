# Boney.AI — AI Mood & Money Companion

> AI yang tahu kamu belanja karena lapar — atau karena luka.

**OpenClaw Agenthon 2026** | RISTEK x Build Club

---

## Problem

57% Gen Z Indonesia menyebut tekanan finansial sebagai pemicu utama masalah kesehatan mental. Tidak ada tools lokal yang menghubungkan mood harian dengan pengeluaran harian secara otomatis.

## Solution

Boney.AI adalah multi-agent system yang:
1. **Track mood harian** (wajib check-in setiap pagi)
2. **Scan email bank otomatis** setiap malam jam 22.00
3. **Analisis korelasi** mood vs pengeluaran setiap minggu (Senin 08.00)
4. **Chat dengan Boney** — AI companion yang memahami konteks finansial & emosional kamu

## Multi-Agent Architecture

| Agent | Trigger | Tools |
|-------|---------|-------|
| **Agent 1: Receipt Scanner** | Cron daily 22.00 WIB | Gmail API, Supabase |
| **Agent 2: Expense Parser** | Event-driven (dipanggil Agent 1) | Claude API, Supabase |
| **Agent 3: Pattern Analyst** | Cron weekly Senin 08.00 WIB | Supabase, Claude API |
| **Agent 4: Boney (Companion)** | User chat + anomaly detection | Supabase, Claude API |

## Tech Stack

- **Frontend:** Next.js 16.2.6 (App Router) + TypeScript + Tailwind CSS v4
- **Database:** Supabase (PostgreSQL)
- **AI:** Claude API (claude-sonnet-4) — dapat di-switch ke DeepSeek via `LLM_PROVIDER`
- **Email:** Gmail API (OAuth 2.0, scope: `gmail.readonly`)
- **Scheduler:** Vercel Cron Jobs
- **Deployment:** Vercel

---

## Installation

### Prerequisites
- Node.js 18+
- Supabase account
- Anthropic API key
- Google Cloud project dengan Gmail API enabled

### Step 1: Install Dependencies

```bash
cd rasakas
npm install
```

### Step 2: Setup Supabase

1. Buat project baru di [supabase.com](https://supabase.com)
2. Buka **SQL Editor**, jalankan kedua migration file secara berurutan:
   - `supabase/migrations/20260515000001_initial_schema.sql`
   - `supabase/migrations/20260515000002_add_rag_and_daily_summary.sql`
3. Ambil credentials dari **Project Settings > API**

### Step 3: Setup Google OAuth (Gmail API)

1. Buka [Google Cloud Console](https://console.cloud.google.com)
2. Enable **Gmail API** di **APIs & Services > Library**
3. Buat OAuth 2.0 credentials (Application type: **Web application**)
4. Tambahkan Authorized redirect URIs:
   - Dev: `http://localhost:3000/api/auth/google`
   - Production: `https://your-domain.vercel.app/api/auth/google`

### Step 4: Configure Environment Variables

```bash
cp .env.local.example .env.local
```

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

# Anthropic Claude API
ANTHROPIC_API_KEY=sk-ant-...

# LLM Provider (opsional, default: anthropic)
# LLM_PROVIDER=anthropic
# LLM_PROVIDER=deepseek
# DEEPSEEK_API_KEY=sk-...

# Gmail OAuth
GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-...
GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/google

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
CRON_SECRET=your_random_secret_here

NODE_ENV=development
```

### Step 5: Seed Demo Data (Opsional)

```bash
npm run seed
```

Membuat: demo user, 30 hari mood logs, 14 hari expenses, 1 weekly report, sample chat history.

### Step 6: Start Development Server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

---

## Running Agents Manually (Demo)

```bash
# Trigger Receipt Scanner + Expense Parser
curl -X POST http://localhost:3000/api/agents/scan-receipts \
  -H "Authorization: Bearer <CRON_SECRET>"

# Trigger Weekly Report
curl -X POST http://localhost:3000/api/agents/weekly-report \
  -H "Authorization: Bearer <CRON_SECRET>"
```

---

## Deployment ke Vercel

### Step 1: Push ke GitHub & Deploy

1. Push repository ke GitHub
2. Import di [vercel.com](https://vercel.com)
3. Set **Root Directory** ke `rasakas`

### Step 2: Environment Variables

Tambahkan semua variabel dari `.env.local`, update nilainya untuk production:
- `GOOGLE_REDIRECT_URI` → `https://your-domain.vercel.app/api/auth/google`
- `NEXT_PUBLIC_APP_URL` → `https://your-domain.vercel.app`
- `NODE_ENV` → `production`

### Step 3: Vercel Cron Jobs

`vercel.json` sudah dikonfigurasi:

```json
{
  "crons": [
    { "path": "/api/cron/scan-receipts", "schedule": "0 22 * * *" },
    { "path": "/api/cron/weekly-report", "schedule": "0 8 * * 1" }
  ]
}
```

Cron endpoints diproteksi via `Authorization: Bearer <CRON_SECRET>`.

### Troubleshooting

**OAuth Error:** Pastikan redirect URI di Google Cloud Console sama persis dengan `GOOGLE_REDIRECT_URI`.

**Cron Tidak Jalan:** Cek `CRON_SECRET` di Vercel env vars dan lihat log di Vercel dashboard.

**Database Error:** Pastikan kedua migration sudah dijalankan dan Supabase project tidak paused.

---

## Database Schema

| Table | Keterangan |
|-------|-----------|
| `users` | Profil user + Gmail OAuth tokens |
| `mood_logs` | Check-in harian; `UNIQUE(user_id, logged_at)`, edit max 2x |
| `expense_logs` | Transaksi hasil parse email; `source_email_id` untuk dedup |
| `weekly_reports` | Laporan korelasi mood vs pengeluaran mingguan |
| `chat_history` | Riwayat percakapan dengan Boney |
| `agent_logs` | Audit trail semua agent runs (untuk juri) |

---

## Key Features

- **Mood Check-In Wajib** — 8 pilihan mood, edit limit 2x/hari, dashboard diblock jika belum check-in
- **30-Day Mood Calendar** — visualisasi color-coded 30 hari terakhir
- **Autonomous Email Scanner** — scan bank email (BCA, Mandiri, BNI, BRI, GoPay, OVO, DANA)
- **Weekly Correlation Report** — AI-generated insight korelasi mood vs pengeluaran
- **Boney AI Companion** — context-aware chat, proactive anomaly intervention, red flag detection

## OpenClaw Agenthon Compliance

- **Tool Call Capability:** Gmail API, Supabase queries, Claude API
- **Autonomous Loop:** Vercel Cron (22.00 daily, Senin 08.00) + event-driven
- **Multi-Agent System:** 4 agents dengan orchestration
- **Reasoning & Decision-Making:** Pattern analysis, categorization, emotional intelligence
- **Bukan Chatbot Biasa:** Boney = proactive + context-aware + tool orchestration

## AI Models Used

- **claude-sonnet-4** (Anthropic) — Expense parsing, pattern analysis, Boney companion
- **DeepSeek** (opsional) — alternatif untuk expense parsing via `LLM_PROVIDER=deepseek`

---

**Last Updated:** 2026-05-15 | **Hackathon Deadline:** 15 Mei 2026, 23.00 WIB
