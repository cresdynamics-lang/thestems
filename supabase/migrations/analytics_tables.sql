-- Live visitor tracking (page views via /api/analytics)

CREATE TABLE IF NOT EXISTS analytics_sessions (
  session_id TEXT PRIMARY KEY,
  user_id TEXT,
  last_seen TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_path TEXT,
  user_agent TEXT,
  device_type TEXT,
  device_name TEXT,
  browser TEXT,
  os TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE analytics_sessions ADD COLUMN IF NOT EXISTS device_type TEXT;
ALTER TABLE analytics_sessions ADD COLUMN IF NOT EXISTS device_name TEXT;
ALTER TABLE analytics_sessions ADD COLUMN IF NOT EXISTS browser TEXT;
ALTER TABLE analytics_sessions ADD COLUMN IF NOT EXISTS os TEXT;

CREATE INDEX IF NOT EXISTS idx_analytics_sessions_last_seen
  ON analytics_sessions (last_seen DESC);

CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event TEXT,
  session_id TEXT,
  user_id TEXT,
  path TEXT,
  title TEXT,
  product_id TEXT,
  product_name TEXT,
  category TEXT,
  price NUMERIC,
  quantity INTEGER,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at
  ON analytics_events (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_analytics_events_event
  ON analytics_events (event, created_at DESC);

-- Optional: enable Supabase Realtime on sessions (SSE is used by default in the staff panel)
-- ALTER PUBLICATION supabase_realtime ADD TABLE analytics_sessions;
