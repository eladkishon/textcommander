import path from "node:path";
import { drizzle as drizzlePg, NodePgDatabase } from "drizzle-orm/node-postgres";
import { migrate as migratePg } from "drizzle-orm/node-postgres/migrator";
import { Client } from "pg";
import * as schema from "./schema";
import "dotenv/config";

// Declare a single shared database instance
let drizzle: NodePgDatabase<typeof schema> | null = null;
// console.log("schema",schema);
async function initializeDatabase() {
  if (drizzle) {
    return drizzle; // Return existing connection if already initialized
  }

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();
    console.log("Database connected successfully.");
  } catch (err) {
    console.error("Connection error:", err.stack);
    throw err;
  }

  drizzle  = drizzlePg(client, { schema });

  // Run migrations only once
  // await migratePg(drizzle, {
  //   migrationsFolder: path.join(process.cwd(), "./migrations"),
  // });

  return drizzle;
}

// Export a function to get the database connection
export async function getDb() {
  return initializeDatabase();
}
