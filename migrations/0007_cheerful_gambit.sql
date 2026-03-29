ALTER TABLE "message" ALTER COLUMN "conversation_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "business_profile" ADD COLUMN "business_type" text;--> statement-breakpoint
ALTER TABLE "business_profile" ADD COLUMN "store_latitude" text;--> statement-breakpoint
ALTER TABLE "business_profile" ADD COLUMN "store_longitude" text;--> statement-breakpoint
ALTER TABLE "business_profile" ADD COLUMN "delivery_price_per_km" text;--> statement-breakpoint
ALTER TABLE "business_profile" ADD COLUMN "is_delivery_enabled" text DEFAULT 'false';--> statement-breakpoint
ALTER TABLE "conversation" ADD COLUMN "status" text DEFAULT 'open';