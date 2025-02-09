ALTER TABLE "shortcuts" ALTER COLUMN "settings" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "shortcuts" ADD COLUMN "is_enabled" boolean NOT NULL;--> statement-breakpoint
ALTER TABLE "shortcuts" ADD CONSTRAINT "shortcuts_user_id_shortcut_name_unique" UNIQUE("user_id","shortcut_name");