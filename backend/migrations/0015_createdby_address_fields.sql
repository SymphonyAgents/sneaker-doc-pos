-- branches: detailed address breakdown + creator tracking
ALTER TABLE "branches" ADD COLUMN IF NOT EXISTS "street_name" varchar(500);
--> statement-breakpoint
ALTER TABLE "branches" ADD COLUMN IF NOT EXISTS "barangay" varchar(255);
--> statement-breakpoint
ALTER TABLE "branches" ADD COLUMN IF NOT EXISTS "city" varchar(255);
--> statement-breakpoint
ALTER TABLE "branches" ADD COLUMN IF NOT EXISTS "province" varchar(255);
--> statement-breakpoint
ALTER TABLE "branches" ADD COLUMN IF NOT EXISTS "country" varchar(100);
--> statement-breakpoint
ALTER TABLE "branches" ADD COLUMN IF NOT EXISTS "created_by_id" uuid;
--> statement-breakpoint
ALTER TABLE "branches" ADD CONSTRAINT "branches_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
--> statement-breakpoint

-- customers: detailed address breakdown
ALTER TABLE "customers" ADD COLUMN IF NOT EXISTS "street_name" varchar(500);
--> statement-breakpoint
ALTER TABLE "customers" ADD COLUMN IF NOT EXISTS "barangay" varchar(255);
--> statement-breakpoint
ALTER TABLE "customers" ADD COLUMN IF NOT EXISTS "province" varchar(255);
--> statement-breakpoint
ALTER TABLE "customers" ADD COLUMN IF NOT EXISTS "country" varchar(100);
--> statement-breakpoint

-- services: creator tracking
ALTER TABLE "services" ADD COLUMN IF NOT EXISTS "created_by_id" uuid;
--> statement-breakpoint
ALTER TABLE "services" ADD CONSTRAINT "services_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
--> statement-breakpoint

-- promos: creator tracking
ALTER TABLE "promos" ADD COLUMN IF NOT EXISTS "created_by_id" uuid;
--> statement-breakpoint
ALTER TABLE "promos" ADD CONSTRAINT "promos_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
