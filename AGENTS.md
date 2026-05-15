<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

# RasaKas — Agent & AI Coding Rules

## Supabase Client Selection (Critical)

There are **three separate Supabase clients** — using the wrong one causes silent bugs or security holes:

| File | Use when | Why |
|------|----------|-----|
| `lib/supabase/client.ts` | Client Components (browser) | Uses anon key |
| `lib/supabase/server.ts` | Server Components, API Routes | Uses anon key + cookies (respects RLS) |
| `lib/supabase/service.ts` | Agent logic only (`lib/agents/`) | Uses service role key — **bypasses RLS** |

**Never** use `service.ts` in API routes that handle user requests. It bypasses Row Level Security entirely.

---

## Multi-Agent Architecture — Respect Boundaries

RasaKas has 4 agents. Each has a single responsibility — do not mix them:

| Agent | File | Responsibility |
|-------|------|----------------|
| Receipt Scanner | `lib/agents/receipt-scanner.ts` | Read Gmail inbox, find receipts |
| Expense Parser | `lib/agents/expense-parser.ts` | Parse email text into structured expense data |
| Pattern Analyst | `lib/agents/pattern-analyst.ts` | Weekly mood × spending correlation analysis |
| Boney | `lib/agents/boney.ts` | Real-time companion chat + anomaly detection |

If you need to add logic that spans two agents, create an orchestration wrapper (like `run-scan-receipts-for-user.ts`) — **do not** add cross-agent calls inside the agent files themselves.

---

## Mood Constants — Never Hardcode

Mood has **8 types** with scores, labels, and colors. Always use `MOOD_CONFIG` from `lib/constants/mood.ts`.

```ts
// ✅ Correct
import { MOOD_CONFIG } from '@/lib/constants/mood'

// ❌ Wrong — will break when mood types change
const isNegative = mood_score <= 3
const label = 'Sedih'
```

The threshold for "negative mood" is `mood_score <= 3`. This is used in pattern-analyst and boney — keep it consistent.

---

## LLM Provider — Use the Abstraction

Expense parsing supports switching providers via `LLM_PROVIDER` env var. Always go through the abstraction layer, not the Anthropic client directly:

```ts
// ✅ Correct (for expense parsing)
import { parseExpenseWithTools } from '@/lib/llm/parse-expense-with-tools'

// ✅ Also correct (for Boney / Pattern Analyst — these are intentionally Anthropic-only)
import Anthropic from '@anthropic-ai/sdk'
```

Boney and Pattern Analyst are Anthropic-only by design (streaming + tool use). Only expense parsing needs provider flexibility.

---

## Boney Mode System

Boney operates in 3 modes detected automatically from user input:

- `listen` — default, active listening, no rushing to solutions
- `humor` — triggered when 3+ consecutive negative moods AND conversation > 4 messages
- `solution` — triggered by keywords: `gimana`, `cara`, `saran`, `solusi`, `tips`

When modifying `detectBoneyMode()`, do not add English-only keywords without also adding the Indonesian equivalent. The target user speaks Indonesian slang.

---

## RAG Search — Currently Mock Data

`lib/agents/rag-search.ts` → `performWebSearch()` returns **hardcoded mock data**. The real web search API (Tavily / Serper / Google Custom Search) is not yet integrated.

- Do not treat RAG results as real-time data
- `detectRAGTopic()` only handles 8 topic patterns — new mental health / financial topics need to be added explicitly
- RAG cache table is `rag_cache` in Supabase, TTL = 24 hours

---

## Cron & Agent Endpoint Authorization

All `/api/cron/` and `/api/agents/` routes require:
```
Authorization: Bearer <CRON_SECRET>
```

Verify via `lib/cron/verify-cron-request.ts`. **Never remove or bypass this check** — these endpoints trigger real email reading and AI generation.

---

## Dashboard Mood Gate

`app/dashboard/page.tsx` blocks access if the user hasn't checked in mood today. This is intentional UX — do not remove this gate. If you need to show dashboard data without the gate (e.g., for agents or admin), create a separate API route, not a bypass on the page.

---

## Claude Model Name

The current model used in Boney (`lib/agents/boney.ts`) is:
```
claude-sonnet-4-20250514
```

Do not downgrade to `claude-3-*` series without explicit instruction. Pattern Analyst uses `ClaudeClient` from `lib/claude/client.ts` — check that file for its model config before making changes.

---

## Red Flag Detection — Safety First

`detectRedFlags()` in `boney.ts` runs **before** the LLM call, not after. If you add new crisis keywords, add them to the `redFlagKeywords` array. The hotline number in the response (`119 ext 8`) is Into The Light Indonesia — do not change this without verifying the replacement is a verified Indonesian crisis line.
