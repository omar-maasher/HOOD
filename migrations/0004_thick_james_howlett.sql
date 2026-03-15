CREATE TABLE IF NOT EXISTS "wa_template" (
	"id" serial PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"name" text NOT NULL,
	"language" text DEFAULT 'ar' NOT NULL,
	"category" text NOT NULL,
	"header_text" text,
	"body_text" text NOT NULL,
	"footer_text" text,
	"buttons" jsonb,
	"meta_status" text DEFAULT 'PENDING',
	"meta_template_id" text,
	"rejected_reason" text,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "webhook_event" (
	"id" serial PRIMARY KEY NOT NULL,
	"mid" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "webhook_event_mid_unique" UNIQUE("mid")
);
--> statement-breakpoint
ALTER TABLE "ai_settings" ADD COLUMN "welcome_message" text DEFAULT 'أهلاً بك {name}! كيف يمكنني مساعدتك؟ (طلب / سعر / دعم / حجز / تواصل بشري)';--> statement-breakpoint
ALTER TABLE "ai_settings" ADD COLUMN "working_hours" jsonb;--> statement-breakpoint
ALTER TABLE "ai_settings" ADD COLUMN "anti_spam" jsonb;--> statement-breakpoint
ALTER TABLE "organization" ADD COLUMN "plan_id" text;--> statement-breakpoint
ALTER TABLE "organization" ADD COLUMN "meta_access_token" text;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "wa_template" ADD CONSTRAINT "wa_template_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
