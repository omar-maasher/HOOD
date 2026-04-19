ALTER TABLE "booking" ADD COLUMN "doctor_name" text;--> statement-breakpoint
ALTER TABLE "booking" ADD COLUMN "service_type" text;--> statement-breakpoint
ALTER TABLE "organization" ADD COLUMN "api_key" text;--> statement-breakpoint
ALTER TABLE "organization" ADD CONSTRAINT "organization_api_key_unique" UNIQUE("api_key");