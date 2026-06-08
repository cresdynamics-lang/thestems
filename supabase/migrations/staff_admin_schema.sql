-- Floral Whispers Gifts – Staff Admin Panel schema extension
-- Run in Supabase SQL Editor after combined_schema.sql

-- Extend admins for staff roles
ALTER TABLE admins ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE admins ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE admins ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMPTZ;
ALTER TABLE admins ADD COLUMN IF NOT EXISTS reset_token TEXT;
ALTER TABLE admins ADD COLUMN IF NOT EXISTS reset_token_expires_at TIMESTAMPTZ;

-- Product extensions
ALTER TABLE products ADD COLUMN IF NOT EXISTS sale_price INTEGER;
ALTER TABLE products ADD COLUMN IF NOT EXISTS sku TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS visibility TEXT DEFAULT 'published';
ALTER TABLE products ADD COLUMN IF NOT EXISTS low_stock_threshold INTEGER DEFAULT 5;
ALTER TABLE products ADD COLUMN IF NOT EXISTS featured_image_index INTEGER DEFAULT 0;

-- Product variants (size/color with own price/stock)
CREATE TABLE IF NOT EXISTS product_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  size_cm INTEGER,
  color TEXT,
  sku TEXT,
  price INTEGER NOT NULL,
  stock INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_product_variants_product ON product_variants(product_id);

-- Custom categories
CREATE TABLE IF NOT EXISTS product_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  db_category TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO product_categories (slug, name, db_category, sort_order) VALUES
  ('flower-bouquets', 'Flower Bouquets', 'flowers', 1),
  ('teddy-bears', 'Teddy Bears', 'teddy', 2),
  ('gift-hampers', 'Gift Hampers', 'hampers', 3),
  ('chocolates', 'Chocolates', 'chocolates', 4),
  ('wines', 'Wines', 'wines', 5),
  ('cakes', 'Cakes', 'hampers', 6),
  ('cards', 'Cards', 'cards', 7)
ON CONFLICT (slug) DO NOTHING;

-- Coupons
CREATE TABLE IF NOT EXISTS coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed', 'free_delivery')),
  discount_value INTEGER NOT NULL DEFAULT 0,
  min_order_value INTEGER DEFAULT 0,
  usage_limit INTEGER,
  times_used INTEGER DEFAULT 0,
  total_discount_given INTEGER DEFAULT 0,
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Customers (aggregated profiles)
CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT NOT NULL,
  notes TEXT,
  is_blocked BOOLEAN DEFAULT false,
  preferred_payment_method TEXT,
  total_orders INTEGER DEFAULT 0,
  total_spend INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone);

-- Delivery zones
CREATE TABLE IF NOT EXISTS delivery_zones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  area TEXT NOT NULL,
  delivery_fee INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Delivery personnel
CREATE TABLE IF NOT EXISTS delivery_personnel (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Order delivery assignment
ALTER TABLE orders ADD COLUMN IF NOT EXISTS assigned_to UUID REFERENCES delivery_personnel(id);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS cancel_reason TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS refund_notes TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending';
ALTER TABLE orders ADD COLUMN IF NOT EXISTS fulfillment_status TEXT DEFAULT 'pending';
ALTER TABLE orders ADD COLUMN IF NOT EXISTS status_history JSONB DEFAULT '[]';
ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_time TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS special_instructions TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS gift_message TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_location TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS recipient_name TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS recipient_phone TEXT;

-- Contact messages
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'resolved')),
  staff_reply TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- WhatsApp notification log
CREATE TABLE IF NOT EXISTS whatsapp_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID,
  phone TEXT,
  message TEXT,
  status TEXT DEFAULT 'sent',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Staff audit logs
CREATE TABLE IF NOT EXISTS staff_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  staff_id UUID,
  staff_email TEXT NOT NULL,
  staff_name TEXT,
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id TEXT,
  details JSONB,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_staff_audit_created ON staff_audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_staff_audit_email ON staff_audit_logs(staff_email);

-- Login audit
CREATE TABLE IF NOT EXISTS staff_login_audit (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  staff_id UUID,
  email TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  success BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Homepage featured sections
CREATE TABLE IF NOT EXISTS homepage_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  product_ids UUID[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Store settings key-value (extends site_settings usage)
INSERT INTO site_settings (key, value, description) VALUES
  ('store_name', 'Floral Whispers Gifts', 'Store display name'),
  ('store_whatsapp', '254700000000', 'WhatsApp number'),
  ('tax_vat_rate', '16', 'VAT percentage'),
  ('low_stock_alert_email', 'true', 'Email on low stock')
ON CONFLICT (key) DO NOTHING;
