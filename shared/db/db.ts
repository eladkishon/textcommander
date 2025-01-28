import path from "node:path";
import { drizzle as drizzlePg } from "drizzle-orm/node-postgres";
import { migrate as migratePg } from "drizzle-orm/node-postgres/migrator";
import { Client } from "pg";
import * as schema from "./schema";
import "dotenv/config";

let client;
let drizzle;
console.log(process.env.DATABASE_URL);
client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});
await client
  .connect()
  .catch((err) => console.error("connection error: ,", err.stack));

drizzle = drizzlePg(client, { schema });
// // Run migrations on app startup (or when needed)
// await migratePg(drizzle, {
//   migrationsFolder: path.join(process.cwd(), "./migrations"),
// });

export const db = drizzle;
