-- Add new tables for RAG and Daily Summary features
-- Created: 2026-05-15
-- Based on updated PRD

-- Table: rag_cache
-- Cache hasil web search RAG per topik
CREATE TABLE rag_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  query TEXT NOT NULL,
  content_snippets JSONB NOT NULL,  -- array of {text, source_url, title}
  source_urls TEXT[],
  expires_at TIMESTAMPTZ NOT NULL,  -- 24 jam dari created_at
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: daily_summaries
-- Notifikasi harian yang dikirim setiap jam 22.00
CREATE TABLE daily_summaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  summary_date DATE NOT NULL,
  mood_label TEXT,
  mood_emoji TEXT,
  total_expense INTEGER DEFAULT 0,
  expense_breakdown JSONB,  -- array of {merchant, amount, category, emoji}
  notification_text TEXT NOT NULL,
  notification_sent BOOLEAN DEFAULT FALSE,
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, summary_date)
);

-- Add mode column to chat_history for tracking Boney's mode
ALTER TABLE chat_history 
ADD COLUMN boney_mode TEXT CHECK (boney_mode IN ('listen', 'humor', 'solution', NULL));

ALTER TABLE chat_history
ADD COLUMN rag_used BOOLEAN DEFAULT FALSE;

ALTER TABLE chat_history
ADD COLUMN rag_sources JSONB;  -- array of source URLs used

-- Indexes
CREATE INDEX idx_rag_cache_query ON rag_cache(query);
CREATE INDEX idx_rag_cache_expires ON rag_cache(expires_at);
CREATE INDEX idx_daily_summaries_user_date ON daily_summaries(user_id, summary_date DESC);
CREATE INDEX idx_daily_summaries_sent ON daily_summaries(notification_sent, summary_date);

-- RLS Policies
ALTER TABLE rag_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_summaries ENABLE ROW LEVEL SECURITY;

-- RAG cache is accessible by service role only (agents)
CREATE POLICY "Service role full access rag_cache" ON rag_cache
  FOR ALL USING (auth.role() = 'service_role');

-- Users can view their own daily summaries
CREATE POLICY "Users can view own daily summaries" ON daily_summaries
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service role full access daily_summaries" ON daily_summaries
  FOR ALL USING (auth.role() = 'service_role');

-- Function to clean expired RAG cache (run daily)
CREATE OR REPLACE FUNCTION clean_expired_rag_cache()
RETURNS void AS $$
BEGIN
  DELETE FROM rag_cache WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

