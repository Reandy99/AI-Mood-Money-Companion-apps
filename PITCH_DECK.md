# RasaKas - Pitch Deck Outline (5 Slides)

**Format:** PDF  
**File Name:** `OpenClaw2026_[NamaTim]_RasaKas.pdf`  
**Design:** Clean, pastel colors matching brand (Pink #FFB5D8, Purple #D4BBFF, Mint #B5F5EC)

---

## Slide 1: Title & Team

### Layout
- **Top:** RasaKas logo (💚) + tagline
- **Center:** Team name + members
- **Bottom:** OpenClaw Agenthon 2026 badge

### Content

```
RasaKas
AI yang tahu kamu belanja karena lapar — atau karena luka 💚

[Nama Tim]
[Nama Anggota 1] • [Nama Anggota 2] • [Nama Anggota 3] • [Nama Anggota 4]

OpenClaw Agenthon 2026
RISTEK x Build Club
```

### Design Notes
- Use pastel gradient background (cream to lavender)
- Large, bold typography for title
- Team photos (optional, circular avatars)
- Subtle blob shapes in background

---

## Slide 2: Problem Statement

### Layout
- **Left:** Statistics + pain points
- **Right:** Visual (illustration or screenshot)

### Content

```
THE PROBLEM

57% Gen Z Indonesia
Tekanan finansial = pemicu utama masalah mental health

❌ Tidak ada tools lokal yang menghubungkan:
   • Mood harian
   • Pengeluaran harian
   • Secara otomatis

❌ Orang tidak sadar:
   • Belanja impulsif saat emosi buruk
   • Pola spending berulang
   • Korelasi mood vs pengeluaran

❌ Manual tracking:
   • Ribet, tidak konsisten
   • Tidak ada insight AI
   • Tidak proactive
```

### Design Notes
- Use icons/emojis for visual interest
- Highlight "57%" in large, bold text
- Color-code pain points (red/orange tones)

---

## Slide 3: Solution Overview

### Layout
- **Top:** Solution statement
- **Center:** 4 agent cards (2x2 grid)
- **Bottom:** Key differentiators

### Content

```
THE SOLUTION

RasaKas: Multi-Agent System untuk Mood & Money Tracking

┌─────────────────┬─────────────────┐
│ Agent 1         │ Agent 2         │
│ Receipt Scanner │ Expense Parser  │
│ 📧 Scan Gmail   │ 🤖 Claude AI    │
│ Daily 22.00     │ Auto categorize │
└─────────────────┴─────────────────┘
┌─────────────────┬─────────────────┐
│ Agent 3         │ Agent 4         │
│ Pattern Analyst │ Boney Companion │
│ 📊 Weekly report│ 💬 Context-aware│
│ Mood correlation│ Proactive chat  │
└─────────────────┴─────────────────┘

✨ Autonomous Loop • 🛠️ Tool Calls • 🧠 AI Reasoning
```

### Design Notes
- Use bento card style (rotated, pastel backgrounds)
- Icons for each agent
- Gradient borders
- Emphasize "autonomous" and "multi-agent"

---

## Slide 4: AI Agent Workflow & Technical Architecture

### Layout
- **Left:** Workflow diagram (flowchart)
- **Right:** Tech stack + compliance

### Content

```
AUTONOMOUS WORKFLOW

07.00 → User check-in mood (wajib)
         ↓
22.00 → Agent 1: Scan Gmail (BCA, Mandiri, BNI, etc)
         ↓
        Agent 2: Parse with Claude API
         ↓
        Save to Supabase + detect anomaly
         ↓
        Agent 4: Proactive notification (if needed)
         ↓
Mon 08.00 → Agent 3: Weekly analysis
         ↓
        Generate AI insight + correlation report

TECH STACK
• Frontend: Next.js 14 + TypeScript + Tailwind
• Database: Supabase (PostgreSQL)
• AI: Claude Sonnet 4 (Anthropic)
• Email: Gmail API (OAuth 2.0)
• Scheduler: Vercel Cron
• Deployment: Vercel

OPENCLAW COMPLIANCE ✅
✓ Tool Call Capability (Gmail, Supabase, Claude, Notifications)
✓ Autonomous Loop (Cron + event-driven)
✓ Multi-Agent System (4 agents, orchestration)
✓ Reasoning & Decision-Making (Pattern analysis, categorization)
✓ Bukan Chatbot Biasa (Proactive intervention + tool orchestration)
```

### Design Notes
- Use arrows/flowchart for workflow
- Color-code each agent step
- Tech stack as icon grid
- Checkmarks for compliance (green)

---

## Slide 5: Key Features & Future Development

### Layout
- **Top:** Key features (3 columns)
- **Bottom:** Future roadmap + impact

### Content

```
KEY FEATURES

┌─────────────────┬─────────────────┬─────────────────┐
│ 😊 Mood Tracking│ 📧 Auto-Scan    │ 📊 AI Analysis  │
│ • 8 mood types  │ • Gmail OAuth   │ • Weekly report │
│ • Edit limit 2x │ • Bank emails   │ • Correlation   │
│ • 30-day view   │ • Deduplication │ • Claude insight│
└─────────────────┴─────────────────┴─────────────────┘
┌─────────────────┬─────────────────┬─────────────────┐
│ 💬 Boney Chat   │ 🔒 Privacy      │ 📱 Mobile-First │
│ • Context-aware │ • Encrypted     │ • PWA ready     │
│ • Proactive     │ • RLS policies  │ • Responsive    │
│ • Safety flags  │ • No data share │ • Offline mode  │
└─────────────────┴─────────────────┴─────────────────┘

FUTURE DEVELOPMENT

🎯 Short-term (3 months)
• Budget recommendations (AI-powered)
• Expense categories customization
• Export reports (PDF/CSV)
• Push notifications (mobile)

🚀 Long-term (6-12 months)
• Integration with e-wallet APIs (GoPay, OVO, DANA)
• Predictive spending alerts
• Community features (anonymous mood sharing)
• Therapist referral network

IMPACT

💚 Mental Health: Early detection of emotional spending patterns
💰 Financial Wellness: Reduce impulsive spending by 30-40%
🎓 Education: Financial literacy for Gen Z Indonesia
📈 Scalability: 10M+ Gen Z users in Indonesia
```

### Design Notes
- Use bento card grid for features
- Icons for each feature
- Timeline/roadmap visual for future dev
- Impact metrics in large, bold text
- End with strong call-to-action visual

---

## 🎨 Design Guidelines

### Color Palette
- **Primary:** Pink #FFB5D8, Purple #D4BBFF, Mint #B5F5EC
- **Background:** Cream #FFF9F0, Lavender #F5F0FF
- **Text:** Dark Gray #2D3748, Medium Gray #718096
- **Accent:** Peach #FFCDB2, Yellow #FFF4B8

### Typography
- **Headings:** Outfit (Bold/Black)
- **Body:** Inter (Regular/Medium)
- **Numbers:** JetBrains Mono (Bold)

### Visual Elements
- Rotated cards (-2° to 2°)
- Soft shadows
- Rounded corners (16-24px)
- Blob shapes in background
- Emojis for visual interest

### Tools
- **Figma** (recommended)
- **Canva** (templates available)
- **Google Slides** (export to PDF)
- **PowerPoint** (export to PDF)

---

## ✅ Pre-Export Checklist

- [ ] All text is readable (min 14pt font)
- [ ] High-resolution images (300 DPI)
- [ ] Consistent branding (colors, fonts)
- [ ] No spelling/grammar errors
- [ ] Team names and roles correct
- [ ] GitHub/Devpost links included (if space)
- [ ] File name: `OpenClaw2026_[NamaTim]_RasaKas.pdf`
- [ ] File size < 10MB

---

## 📤 Export Instructions

1. **Design in Figma/Canva/Slides**
2. **Export as PDF:**
   - Resolution: High quality (300 DPI)
   - Format: PDF
   - Embed fonts: Yes
3. **Verify:**
   - Open PDF and check all pages
   - Ensure no broken images/fonts
   - Test on different devices
4. **Upload to Devpost** in submission form

---

**Good luck! 🚀**
