-- ============================================
-- THE STEMS – FULL DATABASE SCHEMA (RUN ONCE)
-- Run this file in Supabase SQL Editor to create/update everything.
-- Project: https://vzpmqgkcpyupepoggvse.supabase.co
-- ============================================

-- ============================================
-- 1. TABLES
-- ============================================

-- Products
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  short_description TEXT,
  price INTEGER NOT NULL,
  category TEXT NOT NULL,
  subcategory TEXT,
  tags TEXT[] DEFAULT '{}',
  teddy_size INTEGER,
  teddy_color TEXT,
  images TEXT[] DEFAULT '{}',
  included_items JSONB,
  upsells TEXT[],
  stock INTEGER DEFAULT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE products DROP CONSTRAINT IF EXISTS products_category_check;
ALTER TABLE products ADD CONSTRAINT products_category_check
  CHECK (category IN ('flowers', 'hampers', 'teddy', 'wines', 'chocolates', 'cards'));

-- Orders
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  address TEXT NOT NULL,
  delivery_city TEXT,
  delivery_date TIMESTAMPTZ NOT NULL,
  items JSONB NOT NULL,
  total_amount INTEGER NOT NULL,
  total INTEGER,
  payment_method TEXT NOT NULL,
  mpesa_checkout_request_id TEXT,
  mpesa_result_code INTEGER,
  mpesa_receipt_number TEXT,
  pesapal_order_tracking_id TEXT,
  pesapal_payment_method TEXT,
  pesapal_confirmation_code TEXT,
  status TEXT DEFAULT 'pending',
  notes TEXT,
  tip_percentage INTEGER,
  tip_amount INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Rename address to delivery_address if old schema
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'address') THEN
    ALTER TABLE orders RENAME COLUMN address TO delivery_address;
  END IF;
END $$;

ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_payment_method_check;
ALTER TABLE orders ADD CONSTRAINT orders_payment_method_check
  CHECK (payment_method IN ('mpesa', 'mpesa_till', 'mpesa_paybill', 'card'));

ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_status_check;
ALTER TABLE orders ADD CONSTRAINT orders_status_check
  CHECK (status IN ('pending', 'paid', 'failed', 'cancelled', 'shipped'));

-- Add columns if missing (idempotent)
ALTER TABLE orders ADD COLUMN IF NOT EXISTS pesapal_order_tracking_id TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS pesapal_payment_method TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS pesapal_confirmation_code TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS tip_percentage INTEGER;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS tip_amount INTEGER;

-- Admins
CREATE TABLE IF NOT EXISTS admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT,
  role TEXT DEFAULT 'admin',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Site settings
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Blog posts
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  author TEXT NOT NULL DEFAULT 'The Stems Team',
  published_at TIMESTAMPTZ DEFAULT NOW(),
  image TEXT NOT NULL,
  category TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  read_time INTEGER NOT NULL DEFAULT 5,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Products subcategory (if not exists)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'subcategory') THEN
    ALTER TABLE products ADD COLUMN subcategory TEXT;
    CREATE INDEX IF NOT EXISTS idx_products_subcategory ON products(subcategory);
    CREATE INDEX IF NOT EXISTS idx_products_category_subcategory ON products(category, subcategory);
  END IF;
END $$;

-- ============================================
-- 2. INDEXES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_mpesa_checkout ON orders(mpesa_checkout_request_id);
CREATE INDEX IF NOT EXISTS idx_orders_pesapal_tracking ON orders(pesapal_order_tracking_id);
CREATE INDEX IF NOT EXISTS idx_site_settings_key ON site_settings(key);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category);
CREATE INDEX IF NOT EXISTS idx_blog_posts_featured ON blog_posts(featured);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON blog_posts(published_at DESC);

-- ============================================
-- 3. RLS & POLICIES
-- ============================================

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read products" ON products;
CREATE POLICY "Public can read products" ON products FOR SELECT USING (true);

DROP POLICY IF EXISTS "Service role can manage orders" ON orders;
CREATE POLICY "Service role can manage orders" ON orders FOR ALL USING (true);

DROP POLICY IF EXISTS "Public can read site settings" ON site_settings;
CREATE POLICY "Public can read site settings" ON site_settings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read access" ON blog_posts;
DROP POLICY IF EXISTS "Public can read blog posts" ON blog_posts;
CREATE POLICY "Allow public read access" ON blog_posts FOR SELECT USING (true);

-- ============================================
-- 4. FUNCTIONS & TRIGGERS
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_site_settings_updated_at ON site_settings;
CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON site_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_blog_posts_updated_at ON blog_posts;
CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON blog_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 5. STORAGE BUCKET (product images)
-- ============================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Public can view product images" ON storage.objects;
DROP POLICY IF EXISTS "Service role can upload product images" ON storage.objects;
DROP POLICY IF EXISTS "Service role can update product images" ON storage.objects;
DROP POLICY IF EXISTS "Service role can delete product images" ON storage.objects;

CREATE POLICY "Public can view product images" ON storage.objects FOR SELECT USING (bucket_id = 'product-images');
CREATE POLICY "Service role can upload product images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'product-images');
CREATE POLICY "Service role can update product images" ON storage.objects FOR UPDATE USING (bucket_id = 'product-images');
CREATE POLICY "Service role can delete product images" ON storage.objects FOR DELETE USING (bucket_id = 'product-images');

-- ============================================
-- 6. ADMIN & SITE SETTINGS (The Stems)
-- ============================================

INSERT INTO admins (email, password_hash, role)
VALUES ('thestemsflowers.ke@gmail.com', 'Admin@2025', 'admin')
ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash, role = EXCLUDED.role, updated_at = NOW();

DELETE FROM admins WHERE email != 'thestemsflowers.ke@gmail.com';

INSERT INTO site_settings (key, value, description) VALUES
('logo_path', '/images/logo/thestemslogo.jpeg', 'Path to the site logo image'),
('site_name', 'The Stems', 'Name of the website'),
('site_email', 'thestemsflowers.ke@gmail.com', 'Contact email for the site'),
('site_phone', '254725707143', 'Contact phone number'),
('site_url', 'https://the.stems.ke', 'Main website URL')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, description = EXCLUDED.description, updated_at = NOW();

-- ============================================
-- 7. PRODUCT DATA (flowers, teddy, hampers, wines, chocolates)
-- ============================================

DELETE FROM products WHERE slug = 'luxury-gift-hamper' OR (title ILIKE '%luxury gift hamper%' AND price = 25000);

INSERT INTO products (slug, title, short_description, description, price, category, tags, images, teddy_size, teddy_color) VALUES
('classic-rose-romance', 'Classic Rose Romance', 'Mixed Roses with a touch of gypsophilia, Cuddburry Chocolate 80g', 'Mixed Roses with a touch of gypsophilia, Cuddburry Chocolate 80g', 350000, 'flowers', ARRAY[]::text[], ARRAY['/images/products/flowers/BouquetFlowers1.jpg']::text[], NULL, NULL),
('sweet-whisper-bouquet', 'Sweet Whisper Bouquet', '60 Roses with touch of gypsophilia, Ferrero rocher chocolate T8', '60 Roses with touch of gypsophilia, Ferrero rocher chocolate T8', 550000, 'flowers', ARRAY[]::text[], ARRAY['/images/products/flowers/BouquetFlowers2.jpg']::text[], NULL, NULL),
('blush-and-bloom-dreams', 'Blush and Bloom Dreams', 'Baby Pink and white Roses with a touch of gypsophila, Cuddburry chocolate', 'Baby Pink and white Roses with a touch of gypsophila, Cuddburry chocolate', 350000, 'flowers', ARRAY[]::text[], ARRAY['/images/products/flowers/BouquetFlowers4.jpg']::text[], NULL, NULL),
('pure-serenity-bouquet', 'Pure Serenity Bouquet', 'Yellow mumbs mixed with white and Red Roses, Ferrero rocher chocolate T8', 'Yellow mumbs mixed with white and Red Roses, Ferrero rocher chocolate T8', 550000, 'flowers', ARRAY[]::text[], ARRAY['/images/products/flowers/BouquetFlowers5.jpg']::text[], NULL, NULL),
('radiant-love-collection', 'Radiant Love Collection', 'Pink and Red Roses mixed with a touch of gypsophila', 'Pink and Red Roses mixed with a touch of gypsophila', 300000, 'flowers', ARRAY[]::text[], ARRAY['/images/products/flowers/BouquetFlowers6.jpg']::text[], NULL, NULL),
('midnight-bloom-surprises-bouquet', 'Midnight Bloom Surprises Bouquet', 'Red Yellow, Pink, Roses mixed with white mumbs with touch of gypsophilla', 'Red Yellow, Pink, Roses mixed with white mumbs with touch of gypsophilla', 350000, 'flowers', ARRAY[]::text[], ARRAY['/images/products/flowers/BouquetFlowers7.jpg']::text[], NULL, NULL),
('sunset-romance-bouquet', 'Sunset Romance Bouquet', '80 Roses of red Roses and white with a touch of gypsophilla', '80 Roses of red Roses and white with a touch of gypsophilla', 450000, 'flowers', ARRAY[]::text[], ARRAY['/images/products/flowers/BouquetFlowers8.jpg']::text[], NULL, NULL),
('blossom-harmony-bouquet', 'Blossom Harmony Bouquet', '60 Roses with gypsophilla, Cuddburry chocolate', '60 Roses with gypsophilla, Cuddburry chocolate', 350000, 'flowers', ARRAY[]::text[], ARRAY['/images/products/flowers/BouquetFlowers9.jpg']::text[], NULL, NULL)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, short_description = EXCLUDED.short_description, description = EXCLUDED.description, price = EXCLUDED.price, images = EXCLUDED.images, updated_at = NOW();

INSERT INTO products (slug, title, short_description, description, price, category, tags, images, teddy_size, teddy_color) VALUES
('dream-soft-teddy', 'Dream Soft Teddy', '25cm pink teddy bear.', '25cm pink teddy bear. Available in brown, white, red, pink, and blue.', 350000, 'teddy', ARRAY[]::text[], ARRAY['/images/products/teddies/Teddybear1.jpg']::text[], 25, 'pink'),
('fluffyjoy-bear', 'FluffyJoy Bear', '50cm teddy bear.', '50cm teddy bear. Available in brown, white, red, pink, and blue.', 450000, 'teddy', ARRAY[]::text[], ARRAY['/images/products/teddies/TeddyBears1.jpg']::text[], 50, NULL),
('blisshug-teddy', 'BlissHug Teddy', '100cm teddy bear.', '100cm teddy bear. Available in brown, white, red, pink, and blue.', 850000, 'teddy', ARRAY[]::text[], ARRAY['/images/products/teddies/TeddyBears2.jpg']::text[], 100, NULL),
('tender-heart-bear', 'Tender Heart Bear', '120cm teddy bear with customized Stanley mug.', '120cm teddy bear with customized Stanley mug. Available in brown, white, red, pink, and blue.', 1250000, 'teddy', ARRAY[]::text[], ARRAY['/images/products/teddies/TeddyBears3.jpg']::text[], 120, NULL),
('rossyhugs-bear', 'RossyHugs Bear', '180cm brown teddy bear.', '180cm brown teddy bear. Available in brown, white, red, pink, and blue.', 1750000, 'teddy', ARRAY[]::text[], ARRAY['/images/products/teddies/TeddyBears5.jpg']::text[], 180, 'brown'),
('marshmallow-bear', 'MarshMallow Bear', '160cm teddy bear.', '160cm teddy bear. Available in brown, white, red, pink, and blue.', 1550000, 'teddy', ARRAY[]::text[], ARRAY['/images/products/teddies/TeddyBears6.jpg']::text[], 160, NULL),
('moonlight-snuggle-bear', 'Moonlight Snuggle Bear', '200cm teddy bear.', '200cm teddy bear. Available in brown, white, red, pink, and blue.', 1950000, 'teddy', ARRAY[]::text[], ARRAY['/images/products/teddies/TeddyBears7.jpg']::text[], 200, NULL)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, short_description = EXCLUDED.short_description, description = EXCLUDED.description, price = EXCLUDED.price, images = EXCLUDED.images, teddy_size = EXCLUDED.teddy_size, teddy_color = EXCLUDED.teddy_color, updated_at = NOW();

INSERT INTO products (slug, title, short_description, description, price, category, tags, images, teddy_size, teddy_color) VALUES
('warmhugs-gift-hamper', 'WarmHugs Gift Hamper', '100cm teddy bear, Pink Roses flower bouquet, 3 Piece Ferrero rocher chocolate, 4 Packets cuddburry chocolate, Customized gift Hamper', '100cm teddy bear, Pink Roses flower bouquet, 3 Piece Ferrero rocher chocolate, 4 Packets cuddburry chocolate, Customized gift Hamper', 1780000, 'hampers', ARRAY[]::text[], ARRAY['/images/products/hampers/GiftAmper1.jpg']::text[], NULL, NULL),
('sweetheart-snuggler', 'Sweetheart Snuggler', '50cm teddy bear, Flower bouquet, Ferrero rocher chocolate, Bracelet', '50cm teddy bear, Flower bouquet, Ferrero rocher chocolate, Bracelet', 1250000, 'hampers', ARRAY[]::text[], ARRAY['/images/products/hampers/giftamper.jpg']::text[], NULL, NULL),
('gentlepaw-hamper', 'GentlePaw Hamper', '100cm Teddy bear, Flower bouquet, Non Alcoholic wine, Ferrero rocher chocolate T16, Necklace, Bracelet, Watch', '100cm Teddy bear, Flower bouquet, Non Alcoholic wine, Ferrero rocher chocolate T16, Necklace, Bracelet, Watch', 2050000, 'hampers', ARRAY[]::text[], ARRAY['/images/products/hampers/GiftAmper3.jpg']::text[], NULL, NULL),
('signature-celebration-basket', 'Signature Celebration Basket', 'Luxury gift hamper with curated items', 'Luxury gift hamper with curated items', 1050000, 'hampers', ARRAY[]::text[], ARRAY['/images/products/hampers/GiftAmper6.jpg']::text[], NULL, NULL),
('spoil-me-sweet-box', 'Spoil Me Sweet Box', 'Luxury gift hamper with curated items', 'Luxury gift hamper with curated items', 1450000, 'hampers', ARRAY[]::text[], ARRAY['/images/products/hampers/GiftAmper7.jpg']::text[], NULL, NULL),
('aroma-delight-hamper', 'Aroma & Delight Hamper', 'Luxury gift hamper with curated items', 'Luxury gift hamper with curated items', 980000, 'hampers', ARRAY[]::text[], ARRAY['/images/products/hampers/GiftAmper8.jpg']::text[], NULL, NULL),
('care-package-gift-hamper', 'Care Package Gift Hamper', 'Luxury gift hamper with curated items', 'Luxury gift hamper with curated items', 850000, 'hampers', ARRAY[]::text[], ARRAY['/images/products/hampers/GiftAmper10.jpg']::text[], NULL, NULL)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, short_description = EXCLUDED.short_description, description = EXCLUDED.description, price = EXCLUDED.price, images = EXCLUDED.images, updated_at = NOW();

INSERT INTO products (slug, title, short_description, description, price, category, tags, images, teddy_size, teddy_color) VALUES
('luc-belaire-rare-luxe-750ml-jays', 'LUC BELAIRE RARE LUXE 750ML(12.5%) - Jays', 'Premium sparkling wine 750ml', 'Premium sparkling wine 750ml', 350000, 'wines', ARRAY[]::text[], ARRAY['/images/products/wines/Wines1.jpg']::text[], NULL, NULL),
('belaire-brut-750ml', 'Belaire brut 750ml', 'Premium brut sparkling wine 750ml', 'Premium brut sparkling wine 750ml', 750000, 'wines', ARRAY[]::text[], ARRAY['/images/products/wines/Wines2.jpg']::text[], NULL, NULL),
('robertson-red-wine', 'Robertson Red Wine', '750ml Red sweet Wine', '750ml Red sweet Wine', 350000, 'wines', ARRAY[]::text[], ARRAY['/images/products/wines/Wines3.jpg']::text[], NULL, NULL),
('rosso-nobile-red-wine', 'Rosso Nobile Red Wine', '750ml Red wine', '750ml Red wine', 350000, 'wines', ARRAY[]::text[], ARRAY['/images/products/wines/Wines4.jpg']::text[], NULL, NULL)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, short_description = EXCLUDED.short_description, description = EXCLUDED.description, price = EXCLUDED.price, images = EXCLUDED.images, updated_at = NOW();

INSERT INTO products (slug, title, short_description, description, price, category, tags, images, teddy_size, teddy_color) VALUES
('ferrero-rocher-chocolate-8-pieces', 'Ferrero rocher chocolate', '8 pieces', '8 pieces', 150000, 'chocolates', ARRAY[]::text[], ARRAY['/images/products/Chocolates/Chocolates1.jpg']::text[], NULL, NULL),
('ferrero-rocher-chocolate-24-pieces', 'Ferrero rocher chocolate', '24 Pieces', '24 Pieces', 500000, 'chocolates', ARRAY[]::text[], ARRAY['/images/products/Chocolates/Chocolates2.jpg']::text[], NULL, NULL),
('ferrero-rocher-chocolate-16-pieces', 'Ferrero rocher chocolate', '16 pieces', '16 pieces', 350000, 'chocolates', ARRAY[]::text[], ARRAY['/images/products/Chocolates/Chocolates3.jpg']::text[], NULL, NULL)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, short_description = EXCLUDED.short_description, description = EXCLUDED.description, price = EXCLUDED.price, images = EXCLUDED.images, updated_at = NOW();

UPDATE products SET stock = NULL WHERE stock IS NOT NULL;

-- ============================================
-- 8. BLOG POSTS (The Stems – sample + SEO)
-- ============================================

DELETE FROM blog_posts WHERE slug IN (
  'best-gifts-on-christmas-nairobi',
  'flowers-for-my-fiance-on-christmas-nairobi',
  'flowers-on-christmas-nairobi',
  'gifts-for-my-husband-on-christmas-nairobi',
  'gift-for-mom-on-christmas-nairobi'
);

INSERT INTO blog_posts (slug, title, excerpt, content, author, published_at, image, category, tags, read_time, featured) VALUES
('why-flowers-are-still-the-most-meaningful-gifts-today', 'Why Flowers Are Still The Most Meaningful Gifts Today', 'Discover why flowers remain the perfect gift choice in Nairobi. From expressing emotions to brightening someone''s day.', '# Why Flowers Are Still The Most Meaningful Gifts Today\n\nFlowers have been a symbol of love, appreciation, and celebration for centuries. At The Stems, we deliver fresh flowers daily across Nairobi.\n\n## The Language of Flowers\n\nFlowers speak a universal language. A red rose says "I love you," while yellow flowers bring joy. We see how these beautiful blooms brighten lives every day.\n\n## Perfect for Every Occasion\n\nFrom birthdays to anniversaries, graduations to "just because" moments, flowers fit every occasion. At The Stems, we make it easy to send beautiful arrangements across Nairobi.',
  'The Stems Team', NOW() - INTERVAL '7 days', '/images/products/flowers/BouquetFlowers1.jpg', 'Gift Ideas', ARRAY['flowers', 'gifts', 'nairobi', 'meaningful']::text[], 5, true),
('same-day-flower-delivery-nairobi-cbd', 'Same Day Flower Delivery in Nairobi CBD: Your Complete Guide', 'Get fresh flowers delivered the same day in Nairobi CBD, Westlands, Karen, and surrounding areas.', '# Same Day Flower Delivery in Nairobi CBD\n\nWe offer reliable same-day flower delivery across Nairobi CBD, Westlands, Karen, and surrounding areas. Order before 2 PM for same-day delivery. Contact The Stems or place your order online.',
  'The Stems Team', NOW() - INTERVAL '5 days', '/images/products/flowers/BouquetFlowers2.jpg', 'Delivery', ARRAY['delivery', 'nairobi', 'cbd', 'same-day', 'flowers']::text[], 4, true),
('best-gift-hampers-for-corporate-gifting-nairobi', 'Best Gift Hampers for Corporate Gifting in Nairobi', 'Discover premium gift hampers perfect for corporate clients and business partners in Nairobi.', '# Best Gift Hampers for Corporate Gifting in Nairobi\n\nCorporate gifting is an essential part of building strong business relationships. The Stems offers luxury gift hampers with fine wines, gourmet chocolates, and customized items. Same-day delivery available. Contact us for bulk orders.',
  'The Stems Team', NOW() - INTERVAL '3 days', '/images/products/hampers/GiftAmper1.jpg', 'Corporate', ARRAY['corporate', 'gifts', 'hampers', 'nairobi']::text[], 6, false),
('teddy-bears-perfect-gifts-for-every-occasion', 'Teddy Bears: Perfect Gifts for Every Occasion', 'Discover why teddy bears make perfect gifts for birthdays, anniversaries, graduations, and more. Available in various sizes and colors in Nairobi.', '# Teddy Bears: Perfect Gifts for Every Occasion\n\nTeddy bears are timeless gifts that bring joy to people of all ages. At The Stems we offer teddy bears in various sizes (25cm to 200cm) and colors. Same-day delivery available in Nairobi.',
  'The Stems Team', NOW() - INTERVAL '1 day', '/images/products/teddies/Teddybear1.jpg', 'Gift Ideas', ARRAY['teddy-bears', 'gifts', 'nairobi', 'occasions']::text[], 5, false)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, excerpt = EXCLUDED.excerpt, content = EXCLUDED.content, author = EXCLUDED.author, image = EXCLUDED.image, category = EXCLUDED.category, tags = EXCLUDED.tags, updated_at = NOW();

-- SEO blog posts (The Stems branding)
INSERT INTO blog_posts (slug, title, excerpt, content, author, published_at, image, category, tags, read_time, featured) VALUES
('best-gifts-for-men-nairobi', 'Best Gifts for Men Nairobi: Thoughtful Ideas for Every Occasion', 'Discover the best gifts for men in Nairobi. From corporate gift hampers to romantic surprises. Same-day delivery available across Nairobi.', '# Best Gifts for Men Nairobi\n\nAt The Stems we offer curated gifts that men appreciate: corporate gift hampers, romantic hampers, wine and chocolate hampers. Same-day delivery across Nairobi CBD, Westlands, Karen, Lavington. Order before 2 PM. Contact us or order online.',
  'The Stems Team', NOW() - INTERVAL '5 days', '/images/products/hampers/giftamper.jpg', 'Gift Ideas', ARRAY['best gifts for men nairobi', 'corporate gifts nairobi', 'gift hampers nairobi']::text[], 8, true),
('best-gifts-for-wives-nairobi', 'Best Gifts for Wives Nairobi: Surprise Your Wife with Thoughtful Gifts', 'Discover the best gifts for wives in Nairobi. From romantic flowers to surprise gift hampers. Same-day delivery available.', '# Best Gifts for Wives Nairobi\n\nAt The Stems we specialize in romantic flowers, money bouquets, and gift hampers to surprise your wife. Same-day delivery across Nairobi. Order before 2 PM. Contact us or order online.',
  'The Stems Team', NOW() - INTERVAL '4 days', '/images/products/flowers/BouquetFlowers1.jpg', 'Gift Ideas', ARRAY['best gifts for wives nairobi', 'surprise gifts for wife nairobi', 'romantic flowers nairobi']::text[], 7, true),
('money-bouquet-nairobi', 'Money Bouquet Nairobi: Unique Gift Combining Flowers and Money', 'Discover money bouquets in Nairobi. Beautiful flower arrangements creatively combined with money. Same-day delivery available.', '# Money Bouquet Nairobi\n\nAt The Stems we create stunning money bouquets that combine flowers with money for birthdays, anniversaries, graduations. Same-day delivery across Nairobi. M-Pesa payment. Contact us or order online.',
  'The Stems Team', NOW() - INTERVAL '3 days', '/images/products/flowers/BouquetFlowers2.jpg', 'Gift Ideas', ARRAY['money bouquet nairobi', 'money bouquet kenya', 'unique gifts nairobi']::text[], 6, true),
('surprise-gifts-for-wife-nairobi', 'Surprise Gifts for Wife Nairobi: What to Surprise Your Wife With', 'Discover perfect surprise gifts for your wife in Nairobi. Romantic flowers, money bouquets, gift hampers. Same-day delivery available.', '# Surprise Gifts for Wife Nairobi\n\nAt The Stems we help you surprise your wife with romantic flowers, money bouquets, and gift hampers. Same-day delivery across Nairobi. Order before 2 PM. Contact us or order online.',
  'The Stems Team', NOW() - INTERVAL '2 days', '/images/products/flowers/BouquetFlowers4.jpg', 'Gift Ideas', ARRAY['surprise gifts for wife nairobi', 'gifts to surprise wife nairobi']::text[], 7, true),
('best-gifts-for-colleagues-nairobi', 'Best Gifts for Colleagues Nairobi: Corporate Gifts for Work Colleagues', 'Discover the best gifts for colleagues in Nairobi. Corporate gift hampers and thoughtful surprises. Same-day delivery available.', '# Best Gifts for Colleagues Nairobi\n\nAt The Stems we offer corporate gift hampers for colleagues: premium wines, chocolates, coffee, luxury accessories. Same-day delivery to offices in Nairobi. Contact us or order online.',
  'The Stems Team', NOW() - INTERVAL '1 day', '/images/products/hampers/GiftAmper1.jpg', 'Corporate Gifts', ARRAY['best gifts for colleagues nairobi', 'corporate gifts nairobi']::text[], 8, true),
('best-gifts-for-couples-nairobi', 'Best Gifts for Couples Nairobi: Romantic Gifts for Couples', 'Discover the best gifts for couples in Nairobi. Romantic gift hampers and couple experiences. Same-day delivery available.', '# Best Gifts for Couples Nairobi\n\nAt The Stems we offer romantic gift hampers for couples: flowers, chocolates, wine. Same-day delivery across Nairobi. Contact us or order online.',
  'The Stems Team', NOW(), '/images/products/hampers/GiftAmper3.jpg', 'Gift Ideas', ARRAY['best gifts for couples nairobi', 'romantic gifts for couples nairobi']::text[], 6, false),
('best-gifts-for-children-nairobi', 'Best Gifts for Children Nairobi: Perfect Gifts for Kids', 'Discover the best gifts for children in Nairobi. Teddy bears and gift hampers for kids. Same-day delivery available.', '# Best Gifts for Children Nairobi\n\nAt The Stems we offer teddy bears and gift hampers for children. Various sizes and colors. Same-day delivery across Nairobi. Contact us or order online.',
  'The Stems Team', NOW(), '/images/products/teddies/Teddybear1.jpg', 'Gift Ideas', ARRAY['best gifts for children nairobi', 'teddy bears nairobi', 'gifts for kids nairobi']::text[], 6, false)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, excerpt = EXCLUDED.excerpt, content = EXCLUDED.content, author = EXCLUDED.author, image = EXCLUDED.image, category = EXCLUDED.category, tags = EXCLUDED.tags, updated_at = NOW();

UPDATE blog_posts SET featured = true WHERE slug IN (
  'best-gifts-for-men-nairobi',
  'best-gifts-for-wives-nairobi',
  'money-bouquet-nairobi',
  'surprise-gifts-for-wife-nairobi',
  'best-gifts-for-colleagues-nairobi'
);

-- ============================================
-- END – THE STEMS FULL SCHEMA
-- Admin: thestemsflowers.ke@gmail.com / Admin@2025
-- ============================================
