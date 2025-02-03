import { Client } from "pg";
import * as schema from "./schema";
import { drizzle, PostgresJsDatabase } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import "dotenv/config";
// Declare a single shared database instance
// console.log("schema",schema);
let drizzleInstance: PostgresJsDatabase<typeof schema> | null = null;
async function initializeDatabase() {
  if (drizzleInstance) {
    return drizzleInstance; // Return existing connection if already initialized
  }


  // Disable prefetch as it is not supported for "Transaction" pool mode

  try {
    
    console.log("Database connecting...", process.env.DATABASE_URL);
    const client = postgres(process.env.DATABASE_URL as string, { prepare: false })
    drizzleInstance = drizzle({ client });
  } catch (err: any) {
    console.error("Connection error:", err.stack);
    throw err;
  }

  // Run migrations only once
  // await migratePg(drizzle, {
  //   migrationsFolder: path.join(process.cwd(), "./migrations"),
  // });

  return drizzleInstance;
}

// Export a function to get the database connection
export async function getDb() {
  return initializeDatabase();
}
