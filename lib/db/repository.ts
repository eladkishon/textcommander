import { eq } from "drizzle-orm";
import { getDb } from "./db"; // import your db instance
import { trackedFriends, contacts } from "./schema"; // import your schema (table)

export const getTrackedFriends = async (userId: string) => {
  const db = await getDb();
  const friends = await db
    .select()
    .from(trackedFriends)
    .where(eq(trackedFriends.user_id, userId));
  console.log("userContacts:", friends);
  return trackedFriends;
};

export const addTrackedFriend = async (userId: string, friendId: string) => {
  try {
    const db = await getDb();
    const insertedRow = await db
      .insert(trackedFriends)
      .values({
        user_id: userId,
        friend_id: friendId,
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