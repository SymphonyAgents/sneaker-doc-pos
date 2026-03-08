-- users: nickname + full profile fields
ALTER TABLE "users" ADD COLUMN "nickname" varchar(100);
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "full_name" varchar(255);
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "contact_number" varchar(50);
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "birthday" date;
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "address" varchar(500);
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "emergency_contact_name" varchar(255);
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "emergency_contact_number" varchar(50);
--> statement-breakpoint

-- transactions: staff FK + soft delete
ALTER TABLE "transactions" ADD COLUMN "staff_id" uuid;
--> statement-breakpoint
ALTER TABLE "transactions" ADD COLUMN "deleted_at" timestamp with time zone;
--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_staff_id_users_id_fk" FOREIGN KEY ("staff_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
--> statement-breakpoint

-- expenses: track who created it (null = admin)
ALTER TABLE "expenses" ADD COLUMN "staff_id" uuid;
--> statement-breakpoint
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_staff_id_users_id_fk" FOREIGN KEY ("staff_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
--> statement-breakpoint

-- staff_documents: one row per uploaded document per staff member
CREATE TABLE "staff_documents" (
	"id" serial PRIMARY KEY NOT NULL,
	"staff_id" uuid NOT NULL,
	"url" varchar(1000) NOT NULL,
	"label" varchar(255),
	"uploaded_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "staff_documents" ADD CONSTRAINT "staff_documents_staff_id_users_id_fk" FOREIGN KEY ("staff_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
