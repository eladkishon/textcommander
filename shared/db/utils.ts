import { eq } from "drizzle-orm";
import { getDb } from "./db"; // import your db instance
import { trackedFriendsTable, contactsTable } from "./schema"; // import your schema (table)

export const getTrackedFriends = async (userId: string) => {
  const db = await getDb();
  const trackedFriends = db
    .select()
    .from(trackedFriendsTable)
    .where(eq(trackedFriendsTable.user_id, userId));
  console.log("userContacts:", trackedFriends);
  return trackedFriends;
};

export const addTrackedFriend = async (userId: string, friendId: string) => {
  try {
    const db = await getDb();
    const insertedRow = await db
      .insert(trackedFriendsTable)
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
    .from(contactsTable)
    .where(eq(contactsTable.user_id, userId));
  console.log("userContacts:", userContacts);
  return userContacts;
};
