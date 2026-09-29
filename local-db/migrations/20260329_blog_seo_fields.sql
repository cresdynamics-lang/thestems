-- SEO fields for blog_posts (local Postgres)
ALTER TABLE blog_posts
  ADD COLUMN IF NOT EXISTS meta_title TEXT,
  ADD COLUMN IF NOT EXISTS meta_description TEXT,
  ADD COLUMN IF NOT EXISTS focus_keyword TEXT;

COMMENT ON COLUMN blog_posts.meta_title IS 'SEO title override (max ~60 chars preferred)';
COMMENT ON COLUMN blog_posts.meta_description IS 'SEO meta description override (max ~160 chars preferred)';
COMMENT ON COLUMN blog_posts.focus_keyword IS 'Primary SEO keyword for the post';
