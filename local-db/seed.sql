-- =====================================================================
-- The Stems — SEED DATA (extracted from Supabase upload schema)
-- Images: files not present locally are substituted with same-category
-- images (listed in /root/thestems-image-substitutions.md)
-- =====================================================================

-- Admin (matches current .env credentials)
INSERT INTO admins (email, password_hash, role, name, is_active)
VALUES ('thestemsflowers.ke@gmail.com', 'Dan@Admin', 'super_admin', 'The Stems Admin', true)
ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash, role = EXCLUDED.role, is_active = true, updated_at = NOW();

-- Site settings
INSERT INTO site_settings (key, value, description) VALUES
  ('logo_path', '/images/logo/thestemslogo.jpeg', 'Path to the site logo image'),
  ('site_name', 'The Stems', 'Name of the website'),
  ('site_email', 'thestemsflowers.ke@gmail.com', 'Contact email for the site'),
  ('site_phone', '254725707143', 'Contact phone number'),
  ('site_url', 'https://thestemsflowers.co.ke', 'Main website URL'),
  ('store_name', 'The Stems', 'Store display name'),
  ('store_whatsapp', '254725707143', 'WhatsApp number'),
  ('tax_vat_rate', '16', 'VAT percentage'),
  ('low_stock_alert_email', 'true', 'Email on low stock')
ON CONFLICT (key) DO NOTHING;

-- Product categories
INSERT INTO product_categories (slug, name, db_category, sort_order) VALUES
  ('flower-bouquets', 'Flower Bouquets', 'flowers', 1),
  ('teddy-bears', 'Teddy Bears', 'teddy', 2),
  ('gift-hampers', 'Gift Hampers', 'hampers', 3),
  ('chocolates', 'Chocolates', 'chocolates', 4),
  ('wines', 'Wines', 'wines', 5),
  ('cakes', 'Cakes', 'hampers', 6),
  ('cards', 'Cards', 'cards', 7)
ON CONFLICT (slug) DO NOTHING;

-- Homepage sections
INSERT INTO homepage_sections (key, title, is_active, sort_order)
SELECT v.key, v.title, true, v.sort_order
FROM (VALUES
  ('anniversary_gifts', 'Anniversary Gifts - Celebrate Love, Every Year', 1),
  ('birthday_surprises', 'Birthday Surprises - Make Their Day Extraordinary', 2),
  ('same_day_flowers', 'Same-Day Flower Delivery - Express Your Feelings Today', 3),
  ('apology_flowers', 'Apology Flowers - Say Sorry with Beautiful Blooms', 4),
  ('gift_hampers', 'Premium Gift Hampers - Thoughtful Combinations', 5),
  ('teddy_bears', 'Cuddly Teddy Bears - Warm Hugs, Lasting Memories', 6)
) AS v(key, title, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM homepage_sections LIMIT 1);

-- Hero slides (defaults from FALLBACK_HERO_SLIDES)
INSERT INTO hero_slides (title, subtitle, image_url, cta_text, cta_link, sort_order, is_active)
SELECT v.title, v.subtitle, v.image_url, v.cta_text, v.cta_link, v.sort_order, true
FROM (VALUES
  ('Every Moment Deserves to Bloom', 'Flowers, hampers & teddy bears. Same-day delivery Nairobi. Order online with M-Pesa.', '/images/carrousell/Carrousell1.jpeg', 'Shop Now', '/collections', 1),
  ('Anniversary Flowers That Speak Your Heart', 'Roses, bouquets & hampers. Same-day delivery. Till 4202044 • Paybill 880100.', '/images/carrousell/Carrousell2.jpeg', 'Anniversary Gifts', '/collections/flowers', 2),
  ('Surprise Someone Special Today', 'Fresh flowers, chocolates & hampers. Delta Hotel, University Way, Nairobi CBD. Mon–Sat 8AM–8PM.', '/images/carrousell/Carrousell3.jpeg', 'View Collections', '/collections/gift-hampers', 3)
) AS v(title, subtitle, image_url, cta_text, cta_link, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM hero_slides LIMIT 1);

-- ---------- PRODUCTS (canonical data from Supabase schema) ----------
INSERT INTO products (slug, title, short_description, description, price, category, tags, images, teddy_size, teddy_color, visibility) VALUES
  ('classic-rose-romance', 'Classic Rose Romance', 'Mixed Roses with a touch of gypsophilia, Cuddburry Chocolate 80g', 'Mixed Roses with a touch of gypsophilia, Cuddburry Chocolate 80g', 350000, 'flowers', ARRAY[]::text[], ARRAY['/images/products/flowers/BouquetFlowers3.jpg']::text[], NULL, NULL, 'published'),
  ('sweet-whisper-bouquet', 'Sweet Whisper Bouquet', '60 Roses with touch of gypsophilia, Ferrero rocher chocolate T8', '60 Roses with touch of gypsophilia, Ferrero rocher chocolate T8', 550000, 'flowers', ARRAY[]::text[], ARRAY['/images/products/flowers/BouquetFlowers3.jpg']::text[], NULL, NULL, 'published'),
  ('blush-and-bloom-dreams', 'Blush and Bloom Dreams', 'Baby Pink and white Roses with a touch of gypsophila, Cuddburry chocolate', 'Baby Pink and white Roses with a touch of gypsophila, Cuddburry chocolate', 350000, 'flowers', ARRAY[]::text[], ARRAY['/images/products/flowers/BouquetFlowers4.jpg']::text[], NULL, NULL, 'published'),
  ('pure-serenity-bouquet', 'Pure Serenity Bouquet', 'Yellow mumbs mixed with white and Red Roses, Ferrero rocher chocolate T8', 'Yellow mumbs mixed with white and Red Roses, Ferrero rocher chocolate T8', 550000, 'flowers', ARRAY[]::text[], ARRAY['/images/products/flowers/BouquetFlowers5.jpg']::text[], NULL, NULL, 'published'),
  ('radiant-love-collection', 'Radiant Love Collection', 'Pink and Red Roses mixed with a touch of gypsophila', 'Pink and Red Roses mixed with a touch of gypsophila', 300000, 'flowers', ARRAY[]::text[], ARRAY['/images/products/flowers/BouquetFlowers4.jpg']::text[], NULL, NULL, 'published'),
  ('midnight-bloom-surprises-bouquet', 'Midnight Bloom Surprises Bouquet', 'Red Yellow, Pink, Roses mixed with white mumbs with touch of gypsophilla', 'Red Yellow, Pink, Roses mixed with white mumbs with touch of gypsophilla', 350000, 'flowers', ARRAY[]::text[], ARRAY['/images/products/flowers/BouquetFlowers5.jpg']::text[], NULL, NULL, 'published'),
  ('sunset-romance-bouquet', 'Sunset Romance Bouquet', '80 Roses of red Roses and white with a touch of gypsophilla', '80 Roses of red Roses and white with a touch of gypsophilla', 450000, 'flowers', ARRAY[]::text[], ARRAY['/images/products/flowers/BouquetFlowers3.jpg']::text[], NULL, NULL, 'published'),
  ('blossom-harmony-bouquet', 'Blossom Harmony Bouquet', '60 Roses with gypsophilla, Cuddburry chocolate', '60 Roses with gypsophilla, Cuddburry chocolate', 350000, 'flowers', ARRAY[]::text[], ARRAY['/images/products/flowers/BouquetFlowers4.jpg']::text[], NULL, NULL, 'published'),

  ('dream-soft-teddy', 'Dream Soft Teddy', '25cm pink teddy bear.', '25cm pink teddy bear. Available in brown, white, red, pink, and blue.', 350000, 'teddy', ARRAY[]::text[], ARRAY['/images/products/teddies/Teddybear1.jpg']::text[], 25, 'pink', 'published'),
  ('fluffyjoy-bear', 'FluffyJoy Bear', '50cm teddy bear.', '50cm teddy bear. Available in brown, white, red, pink, and blue.', 450000, 'teddy', ARRAY[]::text[], ARRAY['/images/products/teddies/TeddyBears1.jpg']::text[], 50, NULL, 'published'),
  ('blisshug-teddy', 'BlissHug Teddy', '100cm teddy bear.', '100cm teddy bear. Available in brown, white, red, pink, and blue.', 850000, 'teddy', ARRAY[]::text[], ARRAY['/images/products/teddies/TeddyBears1.jpg']::text[], 100, NULL, 'published'),
  ('tender-heart-bear', 'Tender Heart Bear', '120cm teddy bear with customized Stanley mug.', '120cm teddy bear with customized Stanley mug. Available in brown, white, red, pink, and blue.', 1250000, 'teddy', ARRAY[]::text[], ARRAY['/images/products/teddies/TeddyBears3.jpg']::text[], 120, NULL, 'published'),
  ('rossyhugs-bear', 'RossyHugs Bear', '180cm brown teddy bear.', '180cm brown teddy bear. Available in brown, white, red, pink, and blue.', 1750000, 'teddy', ARRAY[]::text[], ARRAY['/images/products/teddies/TeddyBears3.jpg']::text[], 180, 'brown', 'published'),
  ('marshmallow-bear', 'MarshMallow Bear', '160cm teddy bear.', '160cm teddy bear. Available in brown, white, red, pink, and blue.', 1550000, 'teddy', ARRAY[]::text[], ARRAY['/images/products/teddies/TeddyBears1.jpg']::text[], 160, NULL, 'published'),
  ('moonlight-snuggle-bear', 'Moonlight Snuggle Bear', '200cm teddy bear.', '200cm teddy bear. Available in brown, white, red, pink, and blue.', 1950000, 'teddy', ARRAY[]::text[], ARRAY['/images/products/teddies/TeddyBears3.jpg']::text[], 200, NULL, 'published'),

  ('warmhugs-gift-hamper', 'WarmHugs Gift Hamper', '100cm teddy bear, Pink Roses flower bouquet, 3 Piece Ferrero rocher chocolate, 4 Packets cuddburry chocolate, Customized gift Hamper', '100cm teddy bear, Pink Roses flower bouquet, 3 Piece Ferrero rocher chocolate, 4 Packets cuddburry chocolate, Customized gift Hamper', 1780000, 'hampers', ARRAY[]::text[], ARRAY['/images/products/hampers/GiftAmper3.jpg']::text[], NULL, NULL, 'published'),
  ('sweetheart-snuggler', 'Sweetheart Snuggler', '50cm teddy bear, Flower bouquet, Ferrero rocher chocolate, Bracelet', '50cm teddy bear, Flower bouquet, Ferrero rocher chocolate, Bracelet', 1250000, 'hampers', ARRAY[]::text[], ARRAY['/images/products/hampers/GiftAmper3.jpg']::text[], NULL, NULL, 'published'),
  ('gentlepaw-hamper', 'GentlePaw Hamper', '100cm Teddy bear, Flower bouquet, Non Alcoholic wine, Ferrero rocher chocolate T16, Necklace, Bracelet, Watch', '100cm Teddy bear, Flower bouquet, Non Alcoholic wine, Ferrero rocher chocolate T16, Necklace, Bracelet, Watch', 2050000, 'hampers', ARRAY[]::text[], ARRAY['/images/products/hampers/GiftAmper3.jpg']::text[], NULL, NULL, 'published'),
  ('signature-celebration-basket', 'Signature Celebration Basket', 'Luxury gift hamper with curated items', 'Luxury gift hamper with curated items', 1050000, 'hampers', ARRAY[]::text[], ARRAY['/images/products/hampers/GiftAmper6.jpg']::text[], NULL, NULL, 'published'),
  ('spoil-me-sweet-box', 'Spoil Me Sweet Box', 'Luxury gift hamper with curated items', 'Luxury gift hamper with curated items', 1450000, 'hampers', ARRAY[]::text[], ARRAY['/images/products/hampers/GiftAmper6.jpg']::text[], NULL, NULL, 'published'),
  ('aroma-delight-hamper', 'Aroma & Delight Hamper', 'Luxury gift hamper with curated items', 'Luxury gift hamper with curated items', 980000, 'hampers', ARRAY[]::text[], ARRAY['/images/products/hampers/GiftAmper3.jpg']::text[], NULL, NULL, 'published'),
  ('care-package-gift-hamper', 'Care Package Gift Hamper', 'Luxury gift hamper with curated items', 'Luxury gift hamper with curated items', 850000, 'hampers', ARRAY[]::text[], ARRAY['/images/products/hampers/GiftAmper6.jpg']::text[], NULL, NULL, 'published'),

  ('luc-belaire-rare-luxe-750ml-jays', 'LUC BELAIRE RARE LUXE 750ML(12.5%) - Jays', 'Premium sparkling wine 750ml', 'Premium sparkling wine 750ml', 350000, 'wines', ARRAY[]::text[], ARRAY['/images/products/wines/Wines1.jpg']::text[], NULL, NULL, 'published'),
  ('belaire-brut-750ml', 'Belaire brut 750ml', 'Premium brut sparkling wine 750ml', 'Premium brut sparkling wine 750ml', 750000, 'wines', ARRAY[]::text[], ARRAY['/images/products/wines/Wines2.jpg']::text[], NULL, NULL, 'published'),
  ('robertson-red-wine', 'Robertson Red Wine', '750ml Red sweet Wine', '750ml Red sweet Wine', 350000, 'wines', ARRAY[]::text[], ARRAY['/images/products/wines/Wines3.jpg']::text[], NULL, NULL, 'published'),
  ('rosso-nobile-red-wine', 'Rosso Nobile Red Wine', '750ml Red wine', '750ml Red wine', 350000, 'wines', ARRAY[]::text[], ARRAY['/images/products/wines/Wines4.jpg']::text[], NULL, NULL, 'published'),

  ('ferrero-rocher-chocolate-8-pieces', 'Ferrero rocher chocolate', '8 pieces', '8 pieces', 150000, 'chocolates', ARRAY[]::text[], ARRAY['/images/products/Chocolates/Chocolates1.jpg']::text[], NULL, NULL, 'published'),
  ('ferrero-rocher-chocolate-24-pieces', 'Ferrero rocher chocolate', '24 Pieces', '24 Pieces', 500000, 'chocolates', ARRAY[]::text[], ARRAY['/images/products/Chocolates/Chocolates2.jpg']::text[], NULL, NULL, 'published'),
  ('ferrero-rocher-chocolate-16-pieces', 'Ferrero rocher chocolate', '16 pieces', '16 pieces', 350000, 'chocolates', ARRAY[]::text[], ARRAY['/images/products/Chocolates/Chocolates3.jpg']::text[], NULL, NULL, 'published'),

  ('happy-mothers-day-gift-card', 'Happy Mother''s Day Gift Card', 'Honor Mom with a gift card she can use to select her favorite flowers and thoughtful presents.', 'Honor Mom with a gift card she can use to select her favorite flowers and thoughtful presents.', 25000, 'cards', ARRAY[]::text[], ARRAY['/images/giftcards/card3.png']::text[], NULL, NULL, 'published'),
  ('happy-anniversary-gift-card', 'Happy Anniversary Gift Card', 'Mark your special milestone together. A romantic gift card for anniversaries and celebrations of love.', 'Mark your special milestone together. A romantic gift card for anniversaries and celebrations of love.', 25000, 'cards', ARRAY[]::text[], ARRAY['/images/giftcards/card5.png']::text[], NULL, NULL, 'published'),
  ('congratulations-gift-card', 'Congratulations Gift Card', 'Celebrate success with fireworks and excitement. Ideal for new jobs, new homes, and life''s big moments.', 'Celebrate success with fireworks and excitement. Ideal for new jobs, new homes, and life''s big moments.', 25000, 'cards', ARRAY[]::text[], ARRAY['/images/giftcards/card6.png']::text[], NULL, NULL, 'published')
ON CONFLICT (slug) DO NOTHING;

-- ---------- Blog posts ----------
INSERT INTO blog_posts (slug, title, excerpt, content, author, published_at, image, category, tags, read_time, featured) VALUES
  ('why-flowers-are-still-the-most-meaningful-gifts-today', 'Why Flowers Are Still The Most Meaningful Gifts Today', 'Discover why flowers remain the perfect gift choice in Nairobi. From expressing emotions to brightening someone''s day.', '# Why Flowers Are Still The Most Meaningful Gifts Today

Flowers have been a symbol of love, appreciation, and celebration for centuries. At The Stems, we deliver fresh flowers daily across Nairobi.

## The Language of Flowers

Flowers speak a universal language. A red rose says "I love you," while yellow flowers bring joy. We see how these beautiful blooms brighten lives every day.

## Perfect for Every Occasion

From birthdays to anniversaries, graduations to "just because" moments, flowers fit every occasion. At The Stems, we make it easy to send beautiful arrangements across Nairobi.',
  'The Stems Team', NOW() - INTERVAL '7 days', '/images/products/flowers/BouquetFlowers3.jpg', 'Gift Ideas', ARRAY['flowers', 'gifts', 'nairobi', 'meaningful']::text[], 5, true),
  ('same-day-flower-delivery-nairobi-cbd', 'Same Day Flower Delivery in Nairobi CBD: Your Complete Guide', 'Get fresh flowers delivered the same day in Nairobi CBD, Westlands, Karen, and surrounding areas.', '# Same Day Flower Delivery in Nairobi CBD

We offer reliable same-day flower delivery across Nairobi CBD, Westlands, Karen, and surrounding areas. Order before 2 PM for same-day delivery. Contact The Stems or place your order online.',
  'The Stems Team', NOW() - INTERVAL '5 days', '/images/products/flowers/BouquetFlowers4.jpg', 'Delivery', ARRAY['delivery', 'nairobi', 'cbd', 'same-day', 'flowers']::text[], 4, true),
  ('best-gift-hampers-for-corporate-gifting-nairobi', 'Best Gift Hampers for Corporate Gifting in Nairobi', 'Discover premium gift hampers perfect for corporate clients and business partners in Nairobi.', '# Best Gift Hampers for Corporate Gifting in Nairobi

Corporate gifting is an essential part of building strong business relationships. The Stems offers luxury gift hampers with fine wines, gourmet chocolates, and customized items. Same-day delivery available. Contact us for bulk orders.',
  'The Stems Team', NOW() - INTERVAL '3 days', '/images/products/hampers/GiftAmper3.jpg', 'Corporate', ARRAY['corporate', 'gifts', 'hampers', 'nairobi']::text[], 6, false),
  ('teddy-bears-perfect-gifts-for-every-occasion', 'Teddy Bears: Perfect Gifts for Every Occasion', 'Discover why teddy bears make perfect gifts for birthdays, anniversaries, graduations, and more. Available in various sizes and colors in Nairobi.', '# Teddy Bears: Perfect Gifts for Every Occasion

Teddy bears are timeless gifts that bring joy to people of all ages. At The Stems we offer teddy bears in various sizes (25cm to 200cm) and colors. Same-day delivery available in Nairobi.',
  'The Stems Team', NOW() - INTERVAL '1 day', '/images/products/teddies/Teddybear1.jpg', 'Gift Ideas', ARRAY['teddy-bears', 'gifts', 'nairobi', 'occasions']::text[], 5, false),
  ('best-gifts-for-men-nairobi', 'Best Gifts for Men Nairobi: Thoughtful Ideas for Every Occasion', 'Discover the best gifts for men in Nairobi. From corporate gift hampers to romantic surprises. Same-day delivery available across Nairobi.', '# Best Gifts for Men Nairobi

At The Stems we offer curated gifts that men appreciate: corporate gift hampers, romantic hampers, wine and chocolate hampers. Same-day delivery across Nairobi CBD, Westlands, Karen, Lavington. Order before 2 PM. Contact us or order online.',
  'The Stems Team', NOW() - INTERVAL '5 days', '/images/products/hampers/GiftAmper3.jpg', 'Gift Ideas', ARRAY['best gifts for men nairobi', 'corporate gifts nairobi', 'gift hampers nairobi']::text[], 8, true),
  ('best-gifts-for-wives-nairobi', 'Best Gifts for Wives Nairobi: Surprise Your Wife with Thoughtful Gifts', 'Discover the best gifts for wives in Nairobi. From romantic flowers to surprise gift hampers. Same-day delivery available.', '# Best Gifts for Wives Nairobi

At The Stems we specialize in romantic flowers, money bouquets, and gift hampers to surprise your wife. Same-day delivery across Nairobi. Order before 2 PM. Contact us or order online.',
  'The Stems Team', NOW() - INTERVAL '4 days', '/images/products/flowers/BouquetFlowers3.jpg', 'Gift Ideas', ARRAY['best gifts for wives nairobi', 'surprise gifts for wife nairobi', 'romantic flowers nairobi']::text[], 7, true),
  ('money-bouquet-nairobi', 'Money Bouquet Nairobi: Unique Gift Combining Flowers and Money', 'Discover money bouquets in Nairobi. Beautiful flower arrangements creatively combined with money. Same-day delivery available.', '# Money Bouquet Nairobi

At The Stems we create stunning money bouquets that combine flowers with money for birthdays, anniversaries, graduations. Same-day delivery across Nairobi. M-Pesa payment. Contact us or order online.',
  'The Stems Team', NOW() - INTERVAL '3 days', '/images/products/flowers/BouquetFlowers3.jpg', 'Gift Ideas', ARRAY['money bouquet nairobi', 'money bouquet kenya', 'unique gifts nairobi']::text[], 6, true),
  ('surprise-gifts-for-wife-nairobi', 'Surprise Gifts for Wife Nairobi: What to Surprise Your Wife With', 'Discover perfect surprise gifts for your wife in Nairobi. Romantic flowers, money bouquets, gift hampers. Same-day delivery available.', '# Surprise Gifts for Wife Nairobi

At The Stems we help you surprise your wife with romantic flowers, money bouquets, and gift hampers. Same-day delivery across Nairobi. Order before 2 PM. Contact us or order online.',
  'The Stems Team', NOW() - INTERVAL '2 days', '/images/products/flowers/BouquetFlowers4.jpg', 'Gift Ideas', ARRAY['surprise gifts for wife nairobi', 'gifts to surprise wife nairobi']::text[], 7, true),
  ('best-gifts-for-colleagues-nairobi', 'Best Gifts for Colleagues Nairobi: Corporate Gifts for Work Colleagues', 'Discover the best gifts for colleagues in Nairobi. Corporate gift hampers and thoughtful surprises. Same-day delivery available.', '# Best Gifts for Colleagues Nairobi

At The Stems we offer corporate gift hampers for colleagues: premium wines, chocolates, coffee, luxury accessories. Same-day delivery to offices in Nairobi. Contact us or order online.',
  'The Stems Team', NOW() - INTERVAL '1 day', '/images/products/hampers/GiftAmper3.jpg', 'Corporate Gifts', ARRAY['best gifts for colleagues nairobi', 'corporate gifts nairobi']::text[], 8, true),
  ('best-gifts-for-couples-nairobi', 'Best Gifts for Couples Nairobi: Romantic Gifts for Couples', 'Discover the best gifts for couples in Nairobi. Romantic gift hampers and couple experiences. Same-day delivery available.', '# Best Gifts for Couples Nairobi

At The Stems we offer romantic gift hampers for couples: flowers, chocolates, wine. Same-day delivery across Nairobi. Contact us or order online.',
  'The Stems Team', NOW(), '/images/products/hampers/GiftAmper3.jpg', 'Gift Ideas', ARRAY['best gifts for couples nairobi', 'romantic gifts for couples nairobi']::text[], 6, false),
  ('best-gifts-for-children-nairobi', 'Best Gifts for Children Nairobi: Perfect Gifts for Kids', 'Discover the best gifts for children in Nairobi. Teddy bears and gift hampers for kids. Same-day delivery available.', '# Best Gifts for Children Nairobi

At The Stems we offer teddy bears and gift hampers for children. Various sizes and colors. Same-day delivery across Nairobi. Contact us or order online.',
  'The Stems Team', NOW(), '/images/products/teddies/Teddybear1.jpg', 'Gift Ideas', ARRAY['best gifts for children nairobi', 'teddy bears nairobi', 'gifts for kids nairobi']::text[], 6, false)
ON CONFLICT (slug) DO NOTHING;