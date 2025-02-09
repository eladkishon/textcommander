import { Client, Contact } from "whatsapp-web.js";
import { getDb } from "../../../lib/db/db";
import * as schema from "../../../lib/db/schema";
import { and, eq } from "drizzle-orm";
import { UserContact } from "../types";

export const getContact = async (
  client: Client,
  contactName: string,
  userId: string
): Promise<Contact | undefined> => {
  const contact = await getUserContactDB(userId, contactName);
  console.log("contactRecordDB", contact);
  if (!contact) return;
  return await client.getContactById(contact.contact_id);
};

const getUserContactDB = async (
  userId: string,
  contactName: string
): Promise<UserContact | undefined> => {
  const db = await getDb();

  const contact = await db
    .select()
    .from(schema.contacts)
    .where(
      and(
        eq(schema.contacts.user_id, userId),
        eq(schema.contacts.contact_name, contactName)
      )
    );
  console.log(contact[0]);
  return contact[0];
};

export const saveContact = async (
  userId: string,
  contact: Contact
): Promise<void> => {
  if (
    contact.isGroup ||
    !contact.name ||
    !contact.isMyContact ||
    !contact.isWAContact
  ) {
    return;
  }

  if ((await getUserContactDB(contact.name, userId)) !== undefined) {
    return;
  }

  const db = await getDb();
  await db
    .insert(schema.contacts)
    .values({
      user_id: userId,
      contact_id: contact.id._serialized,
      contact_name: contact.name,
      is_tracked: false,
    })
    .onConflictDoNothing();
};

export const saveAllContacts = async (
  userId: string,
  client: Client
): Promise<void> => {
  try {
    if (!userId || !client) return;
    const contacts = await client.getContacts();
    console.log(contacts);
    await Promise.all(contacts.map((contact) => saveContact(userId, contact)));
    console.log("Contacts saved successfully.");
  } catch (error) {
    console.error("Error saving contacts:", error);
  }
};
