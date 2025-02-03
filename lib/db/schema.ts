import {
  pgTable,
  serial,
  text,
  timestamp,
  boolean,
  unique,
} from "drizzle-orm/pg-core";

// Shared tables for both bot and SaaS platform
export const userConfigs = pgTable("user_config", {
  id: serial("id").primaryKey(),
  user_id: text("user_id").notNull().unique(),
  is_initialized: boolean("is_initialized").notNull(),
});

export const contacts = pgTable(
  "user_contacts",
  {
    id: serial("id").primaryKey(),
    user_id: text("user_id").notNull(),
    contact_id: text("contact_id").notNull(),
    contact_name: text("contact_name").notNull().unique(),
    created_at: timestamp("created_at").defaultNow(),
    is_tracked: boolean("tracked").notNull(),
  },
  (table) => {
    return {
      userContactUnique: unique().on(table.user_id, table.contact_id),
    };
  }
);

