import { eq, and } from "drizzle-orm";
import { getDb } from "./db"; // import your db instance
import {  contacts } from "./schema"; // import your schema (table)

export const getTrackedFriends = async (userId: string) => {
  const db = await getDb();
  const friends = await db
    .select()
    .from(contacts)
    .where(and(eq(contacts.user_id, userId), eq(contacts.is_tracked, true)));
  console.log("userContacts:", friends);
  return friends;
};

export const addTrackedFriend = async (userId: string, friendId: string) => {
  try {
    const db = await getDb();
    const insertedRow = await db
      .insert(contacts)
      .values({
        user_id: userId,
        contact_id: friendId,
        contact_name: friendId,
        is_tracked: true,
      })
      .returning();
    return insertedRow;
  } catch (error) {
    console.error("Error inserting tracked friend:", error);
    throw error;
  }
};

export const getUserContacts = async (userId: string) => {
  const db = await getDb();
  const userContacts = db
    .select()
    .from(contacts)
    .where(eq(contacts.user_id, userId));
  console.log("userContacts:", userContacts);
  return userContacts;
};
