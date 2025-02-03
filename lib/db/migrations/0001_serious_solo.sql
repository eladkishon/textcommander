CREATE TABLE "user_contacts" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"contact_id" text NOT NULL,
	"contact_name" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"tracked" boolean NOT NULL,
	CONSTRAINT "user_contacts_contact_name_unique" UNIQUE("contact_name"),
	CONSTRAINT "user_contacts_user_id_contact_id_unique" UNIQUE("user_id","contact_id")
);
--> statement-breakpoint
CREATE TABLE "shortcuts" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"shortcut_name" text NOT NULL,
	"settings" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
DROP TABLE "weather_shortcut" CASCADE;