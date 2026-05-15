-- RasaKas Database Schema
-- Created: 2026-05-15
-- OpenClaw Agenthon 2026

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table: users
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  avatar_url TEXT,
  gmail_token TEXT,           -- encrypted OAuth token
  gmail_refresh_token TEXT,   -- for token refresh
  gmail_connected_at TIMESTAMPTZ,
  onboarded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: mood_logs
CREATE TABLE mood_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  mood_type TEXT NOT NULL CHECK (mood_type IN ('happy', 'calm', 'neutral', 'sad', 'anxious', 'frustrated', 'tired', 'angry')),
  mood_score INTEGER NOT NULL CHECK (mood_score >= 1 AND mood_score <= 10),
  mood_label TEXT NOT NULL,
  note TEXT,
  edit_count INTEGER DEFAULT 0 CHECK (edit_count <= 2),
  logged_at DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, logged_at)
);

-- Table: expense_logs
CREATE TABLE expense_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  merchant TEXT,
  amount INTEGER NOT NULL CHECK (amount >= 0),
  category TEXT NOT NULL CHECK (category IN ('Makanan', 'Transport', 'Belanja', 'Hiburan', 'Kesehatan', 'Langganan', 'Transfer', 'Lainnya')),
  source_email_id TEXT UNIQUE,
  expense_date DATE NOT NULL,
  raw_email_snippet TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: weekly_reports
CREATE TABLE weekly_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  week_start DATE NOT NULL,
  week_end DATE NOT NULL,
  total_expense INTEGER,
  dominant_mood TEXT,
  mood_expense_correlation JSONB,
  top_category TEXT,
  insight_text TEXT,
  emotional_spending_amount INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: chat_history
CREATE TABLE chat_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: agent_logs (untuk juri - audit trail)
CREATE TABLE agent_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_name TEXT NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('started', 'completed', 'failed')),
  input_summary JSONB,
  output_summary JSONB,
  duration_ms INTEGER,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_mood_logs_user_date ON mood_logs(user_id, logged_at DESC);
CREATE INDEX idx_expense_logs_user_date ON expense_logs(user_id, expense_date DESC);
CREATE INDEX idx_expense_logs_email_id ON expense_logs(source_email_id);
CREATE INDEX idx_weekly_reports_user ON weekly_reports(user_id, week_start DESC);
CREATE INDEX idx_chat_history_user ON chat_history(user_id, created_at DESC);
CREATE INDEX idx_agent_logs_user ON agent_logs(user_id, created_at DESC);
CREATE INDEX idx_agent_logs_agent ON agent_logs(agent_name, created_at DESC);

-- Function: Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_mood_logs_updated_at BEFORE UPDATE ON mood_logs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE mood_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE expense_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_logs ENABLE ROW LEVEL SECURITY;

-- Users can only see their own data
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own mood logs" ON mood_logs
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own expenses" ON expense_logs
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own reports" ON weekly_reports
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own chat history" ON chat_history
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own agent logs" ON agent_logs
  FOR ALL USING (auth.uid() = user_id);

-- Service role can do everything (for agents)
CREATE POLICY "Service role full access users" ON users
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access mood_logs" ON mood_logs
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access expense_logs" ON expense_logs
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access weekly_reports" ON weekly_reports
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access chat_history" ON chat_history
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access agent_logs" ON agent_logs
  FOR ALL USING (auth.role() = 'service_role');
