import {
  bigint,
  boolean,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
} from 'drizzle-orm/pg-core';


export const usersConfigTable = pgTable("user_config", {
  id: serial("id").primaryKey(),
  user_id: text("user_id").notNull(),
  is_initialized: boolean("is_initialized").notNull(),
});

export const weatherShortcutTable = pgTable("weather_shortcut", {
  id: serial("id").primaryKey(),
  user_id: text("user_id").notNull(), 
  location: text("location"),
  created_at: timestamp("created_at").defaultNow(),
});
