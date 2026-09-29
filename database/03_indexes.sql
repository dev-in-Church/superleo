-- ============================================================
-- Superleo Marketplace - Indexes
-- Run after 01_schema.sql (and any time):
--   psql "$DATABASE_URL" -f 03_indexes.sql
-- Supports the query patterns used by the Express backend routes.
-- ============================================================

BEGIN;

-- Users: login by email, list staff by business + role
CREATE INDEX IF NOT EXISTS idx_users_business    ON users (business_id);
CREATE INDEX IF NOT EXISTS idx_users_role        ON users (business_id, role);

-- Products: catalog listing by business + availability, category filter
CREATE INDEX IF NOT EXISTS idx_products_business ON products (business_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON products (category_id);
CREATE INDEX IF NOT EXISTS idx_products_avail    ON products (business_id, is_available);

-- Categories
CREATE INDEX IF NOT EXISTS idx_categories_business ON categories (business_id);

-- Orders: dashboards filter by business + status, sort by created_at
CREATE INDEX IF NOT EXISTS idx_orders_business   ON orders (business_id);
CREATE INDEX IF NOT EXISTS idx_orders_status     ON orders (business_id, status);
CREATE INDEX IF NOT EXISTS idx_orders_created    ON orders (business_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_scheduled  ON orders (business_id, scheduled_date);

-- Order items: join back to an order
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items (order_id);

-- Payments: status polling looks up by order + Daraja identifiers
CREATE INDEX IF NOT EXISTS idx_payments_order    ON payments (order_id);
CREATE INDEX IF NOT EXISTS idx_payments_checkout ON payments (checkout_request_id);
CREATE INDEX IF NOT EXISTS idx_payments_status   ON payments (status);

-- Inventory: low-stock scans (quantity <= reorder_level)
CREATE INDEX IF NOT EXISTS idx_inventory_business ON inventory_items (business_id);

-- Production: baker queues by status/date/assignee
CREATE INDEX IF NOT EXISTS idx_production_business ON production_batches (business_id, status);
CREATE INDEX IF NOT EXISTS idx_production_assignee ON production_batches (assigned_to);
CREATE INDEX IF NOT EXISTS idx_production_order    ON production_batches (order_id);

-- Deliveries: dispatcher board by status, rider manifests, route order
CREATE INDEX IF NOT EXISTS idx_deliveries_business ON deliveries (business_id, status);
CREATE INDEX IF NOT EXISTS idx_deliveries_rider    ON deliveries (rider_id, route_seq);
CREATE INDEX IF NOT EXISTS idx_deliveries_order    ON deliveries (order_id);

COMMIT;
