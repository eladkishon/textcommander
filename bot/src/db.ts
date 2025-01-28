import path from "node:path";
import { drizzle as drizzlePg } from "drizzle-orm/node-postgres";
import { Client } from "pg";
import * as schema from "../../shared/db/schema";
require("dotenv/config");

export const setupDatabase = async () => {
  let client;
  let drizzle;

  console.log(process.env.DATABASE_URL);
  console.log("process.env.DATABASE_URL: ", process.env.DATABASE_URL);
  client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  client
    .connect()
    .then(() => {
      console.log("database connected");
    })
    .catch((e) => {
      console.error(e);
    });

  drizzle = drizzlePg(client, { schema });

  // Run migrations on app startup (or when needed)
  // await migratePg(drizzle, {
  //   migrationsFolder: path.join(process.cwd(), "./migrations"),
  // });

  return drizzle;
};
