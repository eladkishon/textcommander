CREATE TABLE IF NOT EXISTS "user_config" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"is_initialized" boolean NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "weather_shortcut" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"location" text,
	"created_at" timestamp DEFAULT now()
);
