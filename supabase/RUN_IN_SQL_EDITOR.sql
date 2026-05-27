-- =============================================================================
-- The Stems — run this ONCE in Supabase → SQL Editor → Run
-- Safe to re-run (uses IF NOT EXISTS / IF NOT EXISTS columns)
-- =============================================================================

-- 1) Live visitors (required for /staff/live-visitors)
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

CREATE INDEX IF NOT EXISTS idx_analytics_events_event_created
  ON analytics_events (event, created_at DESC);

-- 2) Homepage collections editor (required for /staff/content/collections)
CREATE TABLE IF NOT EXISTS homepage_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  product_ids UUID[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3) Product visibility for shop vs draft (staff panel)
ALTER TABLE products ADD COLUMN IF NOT EXISTS visibility TEXT DEFAULT 'published';

-- 4) Faster staff order lists
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders (status);

-- 5) Seed homepage sections if empty
INSERT INTO homepage_sections (key, title, product_ids, is_active, sort_order)
SELECT v.key, v.title, '{}'::uuid[], true, v.sort_order
FROM (VALUES
  ('anniversary_gifts', 'Anniversary Gifts - Celebrate Love, Every Year', 1),
  ('birthday_surprises', 'Birthday Surprises - Make Their Day Extraordinary', 2),
  ('same_day_flowers', 'Same-Day Flower Delivery - Express Your Feelings Today', 3),
  ('apology_flowers', 'Apology Flowers - Say Sorry with Beautiful Blooms', 4),
  ('gift_hampers', 'Premium Gift Hampers - Thoughtful Combinations', 5),
  ('teddy_bears', 'Cuddly Teddy Bears - Warm Hugs, Lasting Memories', 6)
) AS v(key, title, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM homepage_sections LIMIT 1);
