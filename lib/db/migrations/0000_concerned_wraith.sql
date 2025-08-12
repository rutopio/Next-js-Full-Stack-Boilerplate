CREATE TABLE "users_table" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" bigint NOT NULL,
	"email" text DEFAULT '' NOT NULL,
	"password" text DEFAULT '' NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"is_admin" boolean DEFAULT false NOT NULL,
	"created_at" timestamp NOT NULL,
	CONSTRAINT "users_table_user_id_unique" UNIQUE("user_id")
);
