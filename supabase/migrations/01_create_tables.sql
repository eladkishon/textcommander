CREATE TABLE IF NOT EXISTS "user_config" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"is_initialized" boolean NOT NULL,
	CONSTRAINT "user_config_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "weather_shortcut" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"location" text,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "weather_shortcut_user_id_unique" UNIQUE("user_id")
);

CREATE TABLE IF NOT EXISTS "user_contacts" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL UNIQUE,
	"contact_id" text NOT NULL UNIQUE,
	"created_at" timestamp DEFAULT now()
);
CREATE TABLE IF NOT EXISTS "tracked_friends" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"friend_id" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
    CONSTRAINT unique_user_friend UNIQUE("user_id", "friend_id")
);