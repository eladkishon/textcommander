import {
  pgTable,
  serial,
  text,
  timestamp,
  boolean,
  unique,
} from "drizzle-orm/pg-core";

// Shared tables for both bot and SaaS platform
export const userConfigTable = pgTable("user_config", {
  id: serial("id").primaryKey(),
  user_id: text("user_id").notNull().unique(),
  is_initialized: boolean("is_initialized").notNull(),
});

export const weatherShortcutTable = pgTable("weather_shortcut", {
  id: serial("id").primaryKey(),
  user_id: text("user_id").notNull().unique(),
  location: text("location"),
  created_at: timestamp("created_at").defaultNow(),
});

export const contactsTable = pgTable("user_contacts", {
  id: serial("id").primaryKey(),
  user_id: text("user_id").notNull().unique(),
  contact_id: text("contact_id").notNull().unique(),
  created_at: timestamp("created_at").defaultNow(),
});

export const trackedFriendsTable = pgTable(
  "tracked_friends",
  {
    id: serial("id").primaryKey(),
    user_id: text("user_id").notNull(),
    friend_id: text("friend_id").notNull(),
    created_at: timestamp("created_at").defaultNow(),
  },
  (table) => {
    return {
      userFriendUnique: unique().on(table.user_id, table.friend_id),
    };
  }
);
