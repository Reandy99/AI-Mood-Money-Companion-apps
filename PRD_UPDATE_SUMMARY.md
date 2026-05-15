# PRD Update Summary — 15 Mei 2026

## ✅ Perubahan yang Sudah Diimplementasi

### 1. Daily Summary Notification Agent (Fitur Baru!)
**File baru:**
- `lib/agents/daily-summary.ts` - Agent untuk notifikasi harian
- `app/api/agents/daily-summary/route.ts` - API endpoint
- `app/api/summary/today/route.ts` - Get today's summary

**Cara kerja:**
- Jalan otomatis setiap hari jam 22:05 WIB (5 menit setelah Receipt Scanner)
- Ambil mood hari ini dari `mood_logs`
- Ambil pengeluaran hari ini dari `expense_logs`
- Generate teks notifikasi dengan Claude API (hangat & personal)
- Simpan ke tabel `daily_summaries`
- Kirim notifikasi ke user

**Contoh notifikasi:**
```
Rekap hari ini, 15 Mei 🌙

Mood kamu hari ini: 😔 Sedih

Pengeluaran hari ini: Rp 187.000
🍔 GrabFood — Rp 65.000
🛒 Tokopedia — Rp 92.000
☕ Kopi Kenangan — Rp 30.000

Gue notice kamu lagi down dan pengeluaran naik nih. It's okay, kadang kita emang butuh comfort spending.

Mau cerita ke Boney? 💬
```

---

### 2. Boney dengan RAG (Retrieval-Augmented Generation)
**File baru:**
- `lib/agents/rag-search.ts` - RAG search agent

**File diupdate:**
- `lib/agents/boney.ts` - Tambah RAG integration

**Cara kerja:**
1. Detect topik dari pesan user (quarter life crisis, burnout, emotional spending, dll)
2. Kalau topik terdeteksi, jalankan web search untuk ambil referensi
3. Cache hasil search selama 24 jam di tabel `rag_cache`
4. Inject referensi ke context Claude sebelum Boney respond
5. Boney olah referensi jadi respons yang natural (bukan kutipan mentah)

**Topik yang di-detect:**
- Quarter life crisis
- Burnout kerja
- Kecemasan/anxiety
- Depresi
- Emotional spending
- Tips menabung
- Toxic relationship
- Insomnia/overthinking

**Sumber prioritas:**
- Riliv, Halodoc, Into The Light, Alodokter (mental health Indonesia)
- Psychology Today Indonesia, Tirto.id, Kumparan wellbeing
- Reddit r/indonesia (verified threads)
- Jurnal akademik dengan ringkasan publik

---

### 3. Tiga Mode Boney
**Mode 1: Dengerin (Listen) — Default**
- Fokus jadi pendengar aktif
- Parafrase & validasi perasaan
- Tanya pertanyaan terbuka
- TIDAK terburu-buru kasih solusi

**Mode 2: Humor & Healing**
- Aktif kalau conversation udah berat + mood user 3 hari negatif
- Lighten the mood dengan humor yang empathetic
- Reframe situasi dengan cara yang bikin senyum
- Tetap validasi perasaan

**Mode 3: Solusi Praktis (Solution)**
- Aktif kalau user eksplisit minta saran ("gimana", "cara", "tips")
- Kasih teknik konkret & praktis
- Adaptasi ke konteks Indonesia
- RAG aktif untuk ambil referensi

**Deteksi mode otomatis** berdasarkan:
- Kata kunci dalam pesan user
- Panjang percakapan
- Mood history 3 hari terakhir

---

### 4. Database Schema Update
**Tabel baru:**

**`rag_cache`**
```sql
- id (UUID)
- query (TEXT) — query search
- content_snippets (JSONB) — array of {text, source_url, title}
- source_urls (TEXT[])
- expires_at (TIMESTAMPTZ) — 24 jam dari created_at
- created_at (TIMESTAMPTZ)
```

**`daily_summaries`**
```sql
- id (UUID)
- user_id (UUID)
- summary_date (DATE)
- mood_label (TEXT)
- mood_emoji (TEXT)
- total_expense (INTEGER)
- expense_breakdown (JSONB) — array of {merchant, amount, category, emoji}
- notification_text (TEXT)
- notification_sent (BOOLEAN)
- sent_at (TIMESTAMPTZ)
- created_at (TIMESTAMPTZ)
- UNIQUE(user_id, summary_date)
```

**Kolom baru di `chat_history`:**
```sql
- boney_mode (TEXT) — 'listen', 'humor', 'solution'
- rag_used (BOOLEAN) — apakah RAG digunakan
- rag_sources (JSONB) — array of source URLs
```

**Migration file:**
- `supabase/migrations/20260515000002_add_rag_and_daily_summary.sql`

---

### 5. Cron Scheduler Update
**File diupdate:**
- `lib/cron/scheduler.ts`

**Schedule baru:**
- **22:00 WIB** — Receipt Scanner Agent
- **22:05 WIB** — Daily Summary Agent (baru!)
- **Senin 08:00 WIB** — Weekly Report Agent

---

### 6. Kepribadian Boney yang Lebih Jelas
**Nama:** Boney (bukan "Kasa" atau nama lain)

**Bahasa:**
- Santai, campur gaul Indonesia yang natural
- Kayak temen yang pernah baca buku psikologi tapi nggak sok formal
- Bisa serius tapi juga bisa bercanda tepat waktu

**Approach:**
- Warm, empathetic, non-judgmental
- Tahu kapan harus dengerin, kapan harus bikin ketawa, kapan harus kasih insight
- Tidak pernah menghakimi
- Tidak langsung loncat ke solusi sebelum user merasa didengar

---

## 📋 Yang Belum Diimplementasi (Phase 2)

### 1. Integrasi OpenClaw
- Memory jangka panjang user (melampaui 20 pesan)
- Proactive trigger dari OpenClaw
- Sinkronisasi data percakapan ke ekosistem OpenClaw

### 2. Web Search API Integration
- Saat ini RAG menggunakan mock data
- Perlu integrasi dengan: Tavily API, Serper API, atau Google Custom Search
- Filter hasil search untuk quality control

### 3. Push Notification Service
- Saat ini notifikasi hanya disimpan di database
- Perlu integrasi dengan: Firebase Cloud Messaging, OneSignal, atau Expo Push

### 4. RAG Quality Improvements
- Better topic detection (NLP/semantic search)
- Source verification & credibility scoring
- Multi-language support (English + Indonesian)

---

## 🎯 API Endpoints Baru

```
POST  /api/agents/daily-summary      Trigger daily summary agent
GET   /api/summary/today              Get today's daily summary
POST  /api/rag/search                 Trigger RAG web search (manual)
```

---

## 🧪 Testing Checklist

### Daily Summary Agent
- [ ] Test dengan user yang sudah check-in mood
- [ ] Test dengan user yang belum check-in mood
- [ ] Test dengan user yang tidak ada pengeluaran
- [ ] Test dengan user yang pengeluaran tinggi + mood negatif
- [ ] Verify notifikasi text natural & personal

### Boney dengan RAG
- [ ] Test deteksi topik (quarter life crisis, burnout, dll)
- [ ] Test RAG cache (hit & miss)
- [ ] Test 3 mode Boney (listen, humor, solution)
- [ ] Verify referensi di-olah natural (bukan kutipan mentah)
- [ ] Test red flag detection tetap jalan

### Database
- [ ] Run migration 20260515000002
- [ ] Verify RLS policies
- [ ] Test unique constraint di daily_summaries
- [ ] Test RAG cache expiry (24 jam)

### Cron
- [ ] Test manual trigger daily summary
- [ ] Verify cron schedule (22:05 WIB)
- [ ] Test error handling kalau Receipt Scanner gagal

---

## 📝 Notes untuk Demo

1. **Daily Summary** bisa di-trigger manual untuk demo:
   ```bash
   curl -X POST http://localhost:3000/api/agents/daily-summary \
     -H "Authorization: Bearer rasakas_cron_secret_2026"
   ```

2. **RAG** akan otomatis aktif kalau user mention topik tertentu dalam chat

3. **Boney Mode** akan otomatis switch berdasarkan konteks percakapan

4. **Nama AI adalah "Boney"** — pastikan semua UI dan dokumentasi konsisten

---

**Last Updated:** 2026-05-15 23:45 WIB  
**Status:** ✅ Implementasi selesai, siap testing
