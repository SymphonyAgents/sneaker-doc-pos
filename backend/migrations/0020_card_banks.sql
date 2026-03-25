-- UAT batch: card banks table — superadmin-managed card fee rates
-- Apply in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS "card_banks" (
  "id"          serial PRIMARY KEY,
  "name"        varchar(100) UNIQUE NOT NULL,
  "fee_percent" numeric(5, 2) NOT NULL,
  "is_default"  boolean NOT NULL DEFAULT false,
  "created_at"  timestamp NOT NULL DEFAULT now()
);

-- Seed the two existing hardcoded rates
INSERT INTO "card_banks" ("name", "fee_percent", "is_default") VALUES
  ('Default', 3.00, true),
  ('BPI',     3.50, false)
ON CONFLICT ("name") DO NOTHING;
