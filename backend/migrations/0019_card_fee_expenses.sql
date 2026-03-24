-- UAT batch: card processing fee auto-expense tracking
-- Apply in Supabase SQL Editor

-- expenses: add payment_id (links auto card-fee expenses to their payment)
ALTER TABLE "expenses" ADD COLUMN IF NOT EXISTS "payment_id" integer REFERENCES "claim_payments"("id") ON DELETE SET NULL;

-- expenses: add branch_id (for system-generated expenses not tied to a staff member)
ALTER TABLE "expenses" ADD COLUMN IF NOT EXISTS "branch_id" integer REFERENCES "branches"("id") ON DELETE SET NULL;
