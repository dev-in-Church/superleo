-- ============================================================
-- Superleo Marketplace - Bakery Vertical Schema
-- PostgreSQL. Run manually:  psql "$DATABASE_URL" -f 01_schema.sql
-- ============================================================
-- All businesses reuse this same pattern. The `businesses` table
-- is the marketplace registry; the bakery-specific tables below
-- carry a business_id FK so other verticals can be added later
-- with their own tables following the same conventions.
-- ============================================================

BEGIN;

-- ---------- Extensions ----------
CREATE EXTENSION IF NOT EXISTS "pgcrypto";  -- gen_random_uuid()

-- ---------- Enums ----------
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM (
    'super_admin',    -- Superleo platform owner
    'business_admin', -- bakery owner/manager
    'baker',          -- production
    'inventory_clerk',-- stock management
    'dispatcher',     -- delivery coordination
    'rider'           -- delivery agent
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE order_status AS ENUM (
    'pending',        -- created, awaiting payment
    'paid',           -- payment confirmed
    'in_production',  -- being baked
    'ready',          -- ready for pickup/dispatch
    'out_for_delivery',
    'completed',
    'cancelled'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE fulfillment_type AS ENUM ('pickup', 'delivery');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE payment_status AS ENUM ('pending', 'success', 'failed', 'cancelled');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE production_status AS ENUM ('queued', 'in_progress', 'done');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE delivery_status AS ENUM ('unassigned', 'assigned', 'in_transit', 'delivered', 'failed');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ---------- Marketplace registry ----------
CREATE TABLE IF NOT EXISTS businesses (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug          TEXT UNIQUE NOT NULL,             -- 'bakery', 'dairy', ...
  name          TEXT NOT NULL,
  tagline       TEXT,
  description   TEXT,
  is_active     BOOLEAN NOT NULL DEFAULT FALSE,   -- false = "coming soon" placeholder
  accent_color  TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------- Users & roles ----------
CREATE TABLE IF NOT EXISTS users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id   UUID REFERENCES businesses(id) ON DELETE CASCADE,
  name          TEXT NOT NULL,
  email         TEXT UNIQUE NOT NULL,
  phone         TEXT,
  password_hash TEXT NOT NULL,
  role          user_role NOT NULL,
  is_active     BOOLEAN NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------- Product categories ----------
CREATE TABLE IF NOT EXISTS categories (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  slug        TEXT NOT NULL,
  name        TEXT NOT NULL,
  sort_order  INT NOT NULL DEFAULT 0,
  UNIQUE (business_id, slug)
);

-- ---------- Products ----------
CREATE TABLE IF NOT EXISTS products (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id   UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  category_id   UUID REFERENCES categories(id) ON DELETE SET NULL,
  slug          TEXT NOT NULL,
  name          TEXT NOT NULL,
  description   TEXT,
  image_url     TEXT,
  unit          TEXT NOT NULL DEFAULT 'piece',    -- piece, dozen, loaf, kg
  price_cents   INT NOT NULL CHECK (price_cents >= 0),  -- store money as integer cents
  is_available  BOOLEAN NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (business_id, slug)
);

-- ---------- Inventory ----------
CREATE TABLE IF NOT EXISTS inventory_items (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id    UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  product_id     UUID REFERENCES products(id) ON DELETE SET NULL, -- null = raw material
  name           TEXT NOT NULL,
  unit           TEXT NOT NULL DEFAULT 'unit',
  quantity       NUMERIC(12,2) NOT NULL DEFAULT 0,
  reorder_level  NUMERIC(12,2) NOT NULL DEFAULT 0,   -- low-stock threshold
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------- Orders ----------
CREATE TABLE IF NOT EXISTS orders (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id        UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  code               TEXT UNIQUE NOT NULL,          -- human friendly, e.g. SL-BK-000123
  customer_name      TEXT NOT NULL,
  customer_phone     TEXT NOT NULL,
  fulfillment        fulfillment_type NOT NULL,
  status             order_status NOT NULL DEFAULT 'pending',
  -- money, all integer cents
  subtotal_cents     INT NOT NULL DEFAULT 0,
  discount_cents     INT NOT NULL DEFAULT 0,        -- pickup discount
  delivery_fee_cents INT NOT NULL DEFAULT 0,        -- delivery fee
  total_cents        INT NOT NULL DEFAULT 0,
  -- scheduling
  scheduled_date     DATE,
  scheduled_slot     TEXT,                          -- e.g. '09:00-11:00'
  -- delivery target
  delivery_address   TEXT,
  delivery_lat       NUMERIC(9,6),
  delivery_lng       NUMERIC(9,6),
  notes              TEXT,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS order_items (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id      UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id    UUID REFERENCES products(id) ON DELETE SET NULL,
  product_name  TEXT NOT NULL,     -- snapshot at order time
  unit_price_cents INT NOT NULL,   -- snapshot at order time
  quantity      INT NOT NULL CHECK (quantity > 0),
  line_total_cents INT NOT NULL
);

-- ---------- Payments (M-Pesa Daraja) ----------
CREATE TABLE IF NOT EXISTS payments (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id             UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  amount_cents         INT NOT NULL,
  phone                TEXT NOT NULL,
  status               payment_status NOT NULL DEFAULT 'pending',
  -- Daraja STK push identifiers
  merchant_request_id  TEXT,
  checkout_request_id  TEXT,
  mpesa_receipt        TEXT,
  result_code          INT,
  result_desc          TEXT,
  raw_callback         JSONB,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------- Production ----------
CREATE TABLE IF NOT EXISTS production_batches (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id   UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  product_id    UUID REFERENCES products(id) ON DELETE SET NULL,
  order_id      UUID REFERENCES orders(id) ON DELETE SET NULL,
  quantity      INT NOT NULL CHECK (quantity > 0),
  status        production_status NOT NULL DEFAULT 'queued',
  assigned_to   UUID REFERENCES users(id) ON DELETE SET NULL, -- a baker
  scheduled_date DATE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------- Deliveries ----------
CREATE TABLE IF NOT EXISTS deliveries (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id   UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  order_id      UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  rider_id      UUID REFERENCES users(id) ON DELETE SET NULL,
  status        delivery_status NOT NULL DEFAULT 'unassigned',
  route_seq     INT,                    -- position in optimized route
  dispatched_at TIMESTAMPTZ,
  delivered_at  TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMIT;
