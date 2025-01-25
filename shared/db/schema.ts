import {
    pgTable,
    serial,
    text,
    timestamp,
    boolean,
  } from 'drizzle-orm/pg-core';
  
  // Shared tables for both bot and SaaS platform
  export const userConfigTable = pgTable('user_config', {
    id: serial('id').primaryKey(),
    user_id: text('user_id').notNull().unique(),
    is_initialized: boolean('is_initialized').notNull(),
  });
  
  export const weatherShortcutTable = pgTable('weather_shortcut', {
    id: serial('id').primaryKey(),
    user_id: text('user_id').notNull().unique(),
    location: text('location'),
    created_at: timestamp('created_at').defaultNow(),
  });
  