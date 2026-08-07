-- Transaction payment reconciliation support
-- Apply in Supabase SQL Editor before deploying code that references these fields

ALTER TABLE "transactions"
  ADD COLUMN IF NOT EXISTS "reconciled_amount" bigint;

CREATE TABLE IF NOT EXISTS "transaction_reconciliations" (
  "id" serial PRIMARY KEY,
  "transaction_id" integer NOT NULL REFERENCES "transactions"("id") ON DELETE CASCADE,
  "previous_reconciled_amount" bigint,
  "reconciled_amount" bigint NOT NULL,
  "reason" varchar(255),
  "note" text,
  "created_by_user_id" uuid REFERENCES "users"("id") ON DELETE SET NULL,
  "created_at" timestamp with time zone NOT NULL DEFAULT now()
);
