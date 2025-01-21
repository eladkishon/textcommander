import { boolean, integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const usersConfigTable = pgTable("user_config", {
  id: serial("id").primaryKey(),
  userId: text("userId").notNull(),
  is_initialized: boolean("is_initialized").notNull(),
});

export type InsertUserConfig = typeof usersConfigTable.$inferInsert;
export type SelectUserConfig = typeof usersConfigTable.$inferSelect;
