import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';


const client = postgres(process.env.SUPABASE_URL);
export const db = drizzle({ client });

// Function to ensure the table is created
const createUsersConfigTable = async () => {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS user_config (
        id SERIAL PRIMARY KEY,
        user_id TEXT NOT NULL,
        is_initialized BOOLEAN NOT NULL
      );
    `;
  
    try {
      await db.execute(createTableQuery); // This will execute the raw query to create the table
      console.log("user_config table ensured.");
    } catch (error) {
      console.error("Error creating user_config table:", error);
    }
  };
  
  // Call the function to create the table when your app starts
  createUsersConfigTable().catch((err) => {
    console.error("Error during table initialization:", err);
  })