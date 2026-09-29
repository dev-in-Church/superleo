-- ============================================================
-- Superleo Marketplace - Seed Data
-- Run after 01_schema.sql:  psql "$DATABASE_URL" -f 02_seed.sql
-- Idempotent-ish: uses ON CONFLICT on natural keys where possible.
-- ============================================================
-- NOTE: password_hash values below are bcrypt hashes of the
--       placeholder password "superleo123". Change in production.
-- ============================================================

BEGIN;

-- ---------- Businesses (marketplace registry) ----------
-- Bakery is active; the rest are "coming soon" placeholders.
INSERT INTO businesses (slug, name, tagline, description, is_active, accent_color) VALUES
  ('bakery', 'Superleo Bakery', 'Freshly baked, every day',
   'Bread, cakes, mandazi and doughnuts baked fresh. Order for pickup or delivery.', TRUE, '#3d6b4f'),
  ('dairy', 'Superleo Dairy', 'Farm fresh dairy',
   'Milk, yoghurt, cheese and more. Coming soon.', FALSE, '#6b7f3d'),
  ('grocery', 'Superleo Grocery', 'Your daily essentials',
   'Fresh produce and pantry staples. Coming soon.', FALSE, '#7f5a3d'),
  ('butchery', 'Superleo Butchery', 'Quality cuts',
   'Fresh meat and poultry. Coming soon.', FALSE, '#8a3d3d'),
  ('pharmacy', 'Superleo Pharmacy', 'Health, delivered',
   'Prescriptions and wellness products. Coming soon.', FALSE, '#3d5a8a')
ON CONFLICT (slug) DO UPDATE
  SET name = EXCLUDED.name,
      tagline = EXCLUDED.tagline,
      description = EXCLUDED.description,
      is_active = EXCLUDED.is_active,
      accent_color = EXCLUDED.accent_color;

-- ---------- Users (all 6 roles, scoped to the bakery) ----------
WITH bk AS (SELECT id FROM businesses WHERE slug = 'bakery')
INSERT INTO users (business_id, name, email, phone, password_hash, role)
SELECT bk.id, v.name, v.email, v.phone, v.password_hash, v.role::user_role
FROM bk, (VALUES
  (NULL,        'Platform Owner',   'owner@superleo.co.ke',      '254700000000', '$2b$10$oQ0eV3n8i0Xq0m2m3vTq6uJ8m9sQ0eV3n8i0Xq0m2m3vTq6uJ8m9', 'super_admin'),
  ('bakery',    'Bakery Manager',   'manager@superleo.co.ke',    '254700000001', '$2b$10$oQ0eV3n8i0Xq0m2m3vTq6uJ8m9sQ0eV3n8i0Xq0m2m3vTq6uJ8m9', 'business_admin'),
  ('bakery',    'Head Baker',       'baker@superleo.co.ke',      '254700000002', '$2b$10$oQ0eV3n8i0Xq0m2m3vTq6uJ8m9sQ0eV3n8i0Xq0m2m3vTq6uJ8m9', 'baker'),
  ('bakery',    'Stock Clerk',      'stock@superleo.co.ke',      '254700000003', '$2b$10$oQ0eV3n8i0Xq0m2m3vTq6uJ8m9sQ0eV3n8i0Xq0m2m3vTq6uJ8m9', 'inventory_clerk'),
  ('bakery',    'Dispatch Lead',    'dispatch@superleo.co.ke',   '254700000004', '$2b$10$oQ0eV3n8i0Xq0m2m3vTq6uJ8m9sQ0eV3n8i0Xq0m2m3vTq6uJ8m9', 'dispatcher'),
  ('bakery',    'Rider One',        'rider@superleo.co.ke',      '254700000005', '$2b$10$oQ0eV3n8i0Xq0m2m3vTq6uJ8m9sQ0eV3n8i0Xq0m2m3vTq6uJ8m9', 'rider')
) AS v(biz_slug, name, email, phone, password_hash, role)
ON CONFLICT (email) DO NOTHING;

-- ---------- Categories ----------
WITH bk AS (SELECT id FROM businesses WHERE slug = 'bakery')
INSERT INTO categories (business_id, slug, name, sort_order)
SELECT bk.id, v.slug, v.name, v.sort_order
FROM bk, (VALUES
  ('bread',     'Bread',     1),
  ('cakes',     'Cakes',     2),
  ('pastries',  'Pastries',  3),
  ('snacks',    'Snacks',    4)
) AS v(slug, name, sort_order)
ON CONFLICT (business_id, slug) DO NOTHING;

-- ---------- Products (matches storefront mock catalog) ----------
WITH bk AS (SELECT id AS bid FROM businesses WHERE slug = 'bakery')
INSERT INTO products (business_id, category_id, slug, name, description, image_url, unit, price_cents, is_available)
SELECT bk.bid,
       (SELECT id FROM categories c WHERE c.business_id = bk.bid AND c.slug = v.cat),
       v.slug, v.name, v.description, v.image_url, v.unit, v.price_cents, TRUE
FROM bk, (VALUES
  ('bread',    'white-bread',   'White Bread',        'Soft, fresh-baked white loaf.',            '/bakery/bread.png',     'loaf',  8000),
  ('bread',    'brown-bread',   'Brown Bread',        'Wholemeal brown loaf.',                    '/bakery/bread.png',     'loaf',  9000),
  ('cakes',    'vanilla-cake',  'Vanilla Cake',       'Classic vanilla sponge, 1kg.',             '/bakery/cakes.png',     'piece', 120000),
  ('cakes',    'choc-cake',     'Chocolate Cake',     'Rich chocolate cake, 1kg.',                '/bakery/cakes.png',     'piece', 140000),
  ('pastries', 'doughnuts',     'Doughnuts (6pc)',    'Sugar-glazed doughnuts, pack of six.',     '/bakery/doughnuts.png', 'pack',  30000),
  ('snacks',   'mandazi',       'Mandazi (6pc)',      'Traditional spiced mandazi, pack of six.', '/bakery/mandazi.png',   'pack',  18000)
) AS v(cat, slug, name, description, image_url, unit, price_cents)
ON CONFLICT (business_id, slug) DO NOTHING;

-- ---------- Inventory (finished goods + a couple raw materials) ----------
WITH bk AS (SELECT id AS bid FROM businesses WHERE slug = 'bakery')
INSERT INTO inventory_items (business_id, product_id, name, unit, quantity, reorder_level)
SELECT bk.bid,
       (SELECT id FROM products p WHERE p.business_id = bk.bid AND p.slug = v.prod_slug),
       v.name, v.unit, v.quantity, v.reorder_level
FROM bk, (VALUES
  ('white-bread', 'White Bread (stock)',  'loaf', 40,  15),
  ('brown-bread', 'Brown Bread (stock)',  'loaf', 12,  15),   -- below reorder => low stock
  ('doughnuts',   'Doughnuts (stock)',    'pack', 25,  10),
  ('mandazi',     'Mandazi (stock)',      'pack', 8,   10),   -- below reorder => low stock
  (NULL,          'Flour',                'kg',   200, 50),
  (NULL,          'Sugar',                'kg',   60,  40)
) AS v(prod_slug, name, unit, quantity, reorder_level)
ON CONFLICT DO NOTHING;

COMMIT;
