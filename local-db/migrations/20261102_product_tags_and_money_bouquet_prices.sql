-- The staff form saved the two money bouquets in KES although prices are stored in cents.
UPDATE products SET price = 1100000 WHERE slug = 'the-ultimate-grand-prosperity-money-bouquet' AND price = 11000;
UPDATE products SET price = 750000 WHERE slug = 'the-signature-celebration-money-bouquet-custom-ribbon-edition' AND price = 7500;

-- Filter chips and menus read product.tags. Only fills products with no tags yet.
UPDATE products p SET tags = v.tags
FROM (VALUES
  ('blossom-harmony-bouquet', ARRAY['Roses','Gypsophila','Flowers + Chocolate','Romantic','Anniversary','Birthday']),
  ('blush-and-bloom-dreams', ARRAY['Roses','Gypsophila','Flowers + Chocolate','Romantic','Birthday','Just Because']),
  ('classic-rose-romance', ARRAY['Roses','Mixed Bouquets','Gypsophila','Flowers + Chocolate','Romantic','Anniversary']),
  ('midnight-bloom-surprises-bouquet', ARRAY['Roses','Mixed Bouquets','Gypsophila','Birthday','Congratulations']),
  ('pure-serenity-bouquet', ARRAY['Roses','Mixed Bouquets','Flowers + Chocolate','Premium Luxury','Anniversary','Thank You']),
  ('radiant-love-collection', ARRAY['Roses','Gypsophila','Romantic','Just Because']),
  ('sunset-romance-bouquet', ARRAY['Roses','Gypsophila','Romantic','Anniversary']),
  ('sweet-whisper-bouquet', ARRAY['Roses','Gypsophila','Flowers + Chocolate','Premium Luxury','Romantic','Birthday']),
  ('the-ultimate-grand-prosperity-money-bouquet', ARRAY['Premium Luxury','Birthday','Graduation','Congratulations']),
  ('the-signature-celebration-money-bouquet-custom-ribbon-edition', ARRAY['Birthday','Graduation','Congratulations']),
  ('care-package-gift-hamper', ARRAY['Gift Hampers','Luxury Hampers','Just Because']),
  ('aroma-delight-hamper', ARRAY['Gift Hampers','Luxury Hampers']),
  ('signature-celebration-basket', ARRAY['Gift Hampers','Luxury Hampers','Congratulations']),
  ('spoil-me-sweet-box', ARRAY['Gift Hampers','Luxury Hampers','Romantic']),
  ('gentlepaw-hamper', ARRAY['Gift Hampers','Luxury Hampers','Teddy + Flowers','Flowers + Chocolate']),
  ('sweetheart-snuggler', ARRAY['Gift Hampers','Teddy + Flowers','Flowers + Chocolate','Romantic']),
  ('warmhugs-gift-hamper', ARRAY['Gift Hampers','Luxury Hampers','Teddy + Flowers','Flowers + Chocolate']),
  ('congratulations-gift-card', ARRAY['Congratulations']),
  ('happy-anniversary-gift-card', ARRAY['Anniversary']),
  ('happy-mothers-day-gift-card', ARRAY['Mothers Day Gifts'])
) AS v(slug, tags)
WHERE p.slug = v.slug AND cardinality(p.tags) = 0;
