CREATE TABLE IF NOT EXISTS "global_settings" (
	"id" serial PRIMARY KEY NOT NULL,
	"key" text NOT NULL,
	"value" text,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "global_settings_key_unique" UNIQUE("key")
);
--> statement-breakpoint
ALTER TABLE "lead" ADD COLUMN "username" text;--> statement-breakpoint
ALTER TABLE "lead" ADD COLUMN "external_id" text;