ALTER TABLE "users_table" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "users_table" ADD COLUMN "updated_at" timestamp NOT NULL;