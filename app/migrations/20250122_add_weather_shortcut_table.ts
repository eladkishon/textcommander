import { sql } from 'drizzle-orm';

export default async function up(db: any) {
  await db.execute(sql`
    CREATE TABLE weather_shortcut (
      id SERIAL PRIMARY KEY,
      user_id TEXT NOT NULL,
      location TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT now()
    );
  `);
}

export async function down(db: any) {
  await db.execute(sql`
    DROP TABLE IF EXISTS weather_shortcut;
  `);
}