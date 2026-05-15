# Boney.AI - Submission Checklist

**Deadline:** 15 Mei 2026, 23.00 WIB  
**Platform:** Devpost ([openclawagenthon.devpost.com](https://openclawagenthon.devpost.com))

---

## 📋 Pre-Submission Checklist

### 1. Code & Repository

- [ ] **GitHub Repository Created**
  - Repository name: `OpenClaw2026_[NamaTim]_Boney.AI`
  - Visibility: **Public**
  - Created after: 15 Mei 2026, 09:45 WIB
  - First commit timestamp shows competition start time

- [ ] **README.md Complete**
  - Problem statement
  - Solution overview
  - Multi-agent architecture diagram
  - Tech stack
  - Installation instructions (step-by-step)
  - Running agents manually (demo commands)
  - Deployment instructions
  - Database schema
  - Key features
  - OpenClaw compliance checklist
  - AI models used
  - Team information
  - License

- [ ] **Code Quality**
  - No sensitive data in code (API keys, passwords)
  - `.env.local.example` provided
  - `.gitignore` configured correctly
  - Code is well-commented
  - TypeScript types defined
  - No console errors in production build

- [ ] **Commit History**
  - Regular commits throughout 12-hour period
  - Meaningful commit messages
  - Shows development progress
  - No commits after deadline (23:00 WIB)

### 2. Application Functionality

- [ ] **Core Features Working**
  - Google OAuth login
  - Mood check-in (8 moods, edit limit 2x)
  - 30-day mood calendar
  - Dashboard with stats
  - Weekly report page
  - Chat with Boney (streaming)
  - Settings page

- [ ] **Multi-Agent System**
  - Agent 1: Receipt Scanner (Gmail API)
  - Agent 2: Expense Parser (Claude API)
  - Agent 3: Pattern Analyst (weekly report)
  - Agent 4: Boney (context-aware chat)
  - Agent logs visible in database
  - Manual trigger endpoints work

- [ ] **Database**
  - All tables created (6 tables)
  - RLS policies configured
  - Seed data script works
  - Migrations documented

- [ ] **API Endpoints**
  - `/api/auth/google` - OAuth callback
  - `/api/mood` - Mood CRUD
  - `/api/mood/today` - Check-in status
  - `/api/chat` - Streaming chat
  - `/api/chat/history` - Chat history
  - `/api/dashboard` - Dashboard data
  - `/api/report/latest` - Weekly report
  - `/api/expenses` - Expense list
  - `/api/agents/scan-receipts` - Manual trigger
  - `/api/agents/weekly-report` - Manual trigger

- [ ] **Error Handling**
  - Loading states on all pages
  - Error messages user-friendly
  - 404 page exists
  - API errors handled gracefully

- [ ] **Responsive Design**
  - Mobile-first design
  - Works on 320px - 1920px screens
  - Bottom navigation on mobile
  - Touch-friendly buttons

### 3. Deployment

- [ ] **Vercel Deployment**
  - App deployed and accessible
  - Custom domain (optional) or vercel.app URL
  - Environment variables configured
  - Build successful (no errors)
  - All pages load correctly

- [ ] **Vercel Cron Jobs**
  - `vercel.json` configured
  - Receipt scanner: Daily 22:00 WIB
  - Weekly report: Monday 08:00 WIB
  - Cron endpoints secured with `CRON_SECRET`

- [ ] **Google OAuth Production**
  - Redirect URI updated for production domain
  - OAuth consent screen configured
  - Test login flow works

- [ ] **Performance**
  - Lighthouse score > 80
  - No console errors
  - Fast page loads (< 3s)

### 4. Demo Video

- [ ] **Video Created**
  - Duration: Max 2 minutes
  - Resolution: 1920x1080 (Full HD)
  - Format: MP4
  - Audio: Clear voiceover, no background noise

- [ ] **Content Covered**
  - Problem statement (0:00-0:20)
  - Solution overview (0:20-0:35)
  - Mood check-in demo (0:35-0:45)
  - Dashboard & auto-scan (0:45-1:00)
  - Weekly report (1:00-1:20)
  - Chat with Boney (1:20-1:45)
  - Multi-agent architecture (1:45-1:55)
  - Call to action (1:55-2:00)

- [ ] **YouTube Upload**
  - Title: `OpenClaw2026_[NamaTim]_Boney.AI`
  - Description: Includes GitHub link, tech stack, team
  - Visibility: **Unlisted** (important!)
  - Custom thumbnail (optional but recommended)
  - Link copied for Devpost submission

### 5. Pitch Deck

- [ ] **Deck Created**
  - Format: PDF
  - File name: `OpenClaw2026_[NamaTim]_Boney.AI.pdf`
  - Max 5 slides
  - File size < 10MB

- [ ] **Slides Content**
  - Slide 1: Title & Team
  - Slide 2: Problem Statement
  - Slide 3: Solution Overview (4 agents)
  - Slide 4: AI Workflow & Technical Architecture
  - Slide 5: Key Features & Future Development

- [ ] **Design Quality**
  - Consistent branding (colors, fonts)
  - High-resolution images (300 DPI)
  - Readable text (min 14pt)
  - No spelling/grammar errors
  - Professional appearance

### 6. Devpost Submission

- [ ] **Project Information**
  - Project name: Boney.AI
  - Tagline: "AI yang tahu kamu belanja karena lapar — atau karena luka"
  - Description: Comprehensive (problem, solution, tech stack, features)
  - Built with: Next.js, Supabase, Claude API, Gmail API, Vercel

- [ ] **Links**
  - GitHub repository: `https://github.com/[username]/OpenClaw2026_[NamaTim]_Boney.AI`
  - Live deployment: `https://your-domain.vercel.app`
  - Demo video: YouTube Unlisted link

- [ ] **Files**
  - Pitch deck PDF uploaded
  - Screenshots uploaded (4-6 images)

- [ ] **AI Tools / Models Used**
  - Claude Sonnet 4 (Anthropic) - Expense parsing, pattern analysis, Boney companion
  - Gmail API - Email scanning
  - Supabase - Database & auth

- [ ] **Categories**
  - Select "Best Payment Use Case" if applicable
  - Add relevant tags: AI, Multi-Agent, Mental Health, Finance

- [ ] **Team Members**
  - All team members added
  - Roles specified

### 7. Final Verification

- [ ] **Test Full Flow**
  - Sign up with Google
  - Complete onboarding
  - Check-in mood
  - View dashboard
  - Navigate to calendar
  - Chat with Boney
  - View weekly report
  - Check settings
  - Logout and login again

- [ ] **Test on Multiple Devices**
  - Desktop (Chrome, Firefox, Safari)
  - Mobile (iOS Safari, Android Chrome)
  - Tablet (iPad, Android tablet)

- [ ] **Test Manual Agent Triggers**
  ```bash
  curl -X POST https://your-domain.vercel.app/api/agents/scan-receipts \
    -H "Authorization: Bearer rasakas_cron_secret_2026"
  
  curl -X POST https://your-domain.vercel.app/api/agents/weekly-report \
    -H "Authorization: Bearer rasakas_cron_secret_2026"
  ```

- [ ] **Check Agent Logs**
  - Verify logs are saved to `agent_logs` table
  - Check timestamps, status, input/output summaries

- [ ] **Accessibility**
  - Keyboard navigation works
  - Screen reader friendly (basic)
  - Color contrast sufficient

### 8. Documentation

- [ ] **AGENTS.md** (if exists)
  - Detailed agent descriptions
  - Tool usage documentation
  - Autonomous loop explanation

- [ ] **DESIGN.md** (if exists)
  - Design system documentation
  - Color palette
  - Typography
  - Component patterns

- [ ] **CLAUDE.md** (if exists)
  - Claude API usage
  - Prompt engineering
  - Response handling

- [ ] **Environment Variables Documented**
  - `.env.local.example` complete
  - All variables explained in README

### 9. Compliance Verification

- [ ] **OpenClaw Agenthon Requirements**
  - ✅ Tool Call Capability: Gmail API, Supabase, Claude API, Notifications
  - ✅ Autonomous Loop: Cron-based + event-driven triggers
  - ✅ Multi-Agent System: 4 agents with orchestration
  - ✅ Reasoning & Decision-Making: Pattern analysis, categorization, emotional intelligence
  - ✅ Bukan Chatbot Biasa: Proactive intervention + tool orchestration

- [ ] **Repository Requirements**
  - ✅ Created after competition start (15 Mei 2026, 09:45 WIB)
  - ✅ Public visibility
  - ✅ Commit history shows development during competition
  - ✅ README.md with installation instructions

- [ ] **Submission Requirements**
  - ✅ Submitted via Devpost before deadline (23:00 WIB)
  - ✅ GitHub repository link
  - ✅ Demo video (YouTube Unlisted, max 2 min)
  - ✅ Pitch deck (PDF, max 5 slides)
  - ✅ Live deployment link (optional but recommended)

### 10. Pre-Deadline Actions

**2 Hours Before Deadline (21:00 WIB):**
- [ ] Final code commit
- [ ] Final deployment to Vercel
- [ ] Test all features one last time
- [ ] Upload demo video to YouTube
- [ ] Upload pitch deck to Devpost
- [ ] Fill in all Devpost fields

**1 Hour Before Deadline (22:00 WIB):**
- [ ] Submit to Devpost
- [ ] Verify submission received
- [ ] Take screenshot of submission confirmation
- [ ] **STOP all code changes** (no more commits!)

**After Submission:**
- [ ] Celebrate! 🎉
- [ ] Share submission link with team
- [ ] Backup all files locally
- [ ] Rest and prepare for judging

---

## 🚨 Common Mistakes to Avoid

1. **Late Submission:** Submit at least 30 minutes before deadline
2. **Private Repository:** Must be Public for judges to access
3. **Broken Links:** Test all links before submitting
4. **Missing Demo Video:** Required, not optional
5. **Wrong Video Visibility:** Must be Unlisted, not Private
6. **Commits After Deadline:** Will be flagged by judges
7. **Exposed Secrets:** Check for API keys in code
8. **Incomplete README:** Must have installation instructions
9. **Non-Functional Deployment:** Test live URL before submitting
10. **Missing Team Members:** Add all members to Devpost

---

## 📞 Emergency Contacts

- **Panitia OpenClaw:** [Discord/Telegram link]
- **Technical Issues:** [Support email]
- **Devpost Support:** help@devpost.com

---

## ✅ Final Checklist Summary

```
[ ] Code complete & committed
[ ] GitHub repository public
[ ] README.md comprehensive
[ ] App deployed to Vercel
[ ] Demo video uploaded (YouTube Unlisted)
[ ] Pitch deck created (PDF)
[ ] Devpost submission complete
[ ] All links tested
[ ] Team members added
[ ] Submitted before 23:00 WIB
```

---

**Good luck! You've got this! 🚀💚**
