import { Client, Contact } from "whatsapp-web.js";
import { getDb } from "../../../lib/db/db";
import * as schema from "../../../lib/db/schema";
import { eq } from "drizzle-orm";

export class ContactService {
  private userId: string;
  private client: Client;

  constructor(userId: string, client: Client) {
    this.userId = userId;
    this.client = client;
  }

  private async isContactExists(contactName: string): Promise<boolean> {
    const db = await getDb();
    const existingContact = await db.query.contacts?.findFirst({
      where: (contacts, { eq }) => eq(contacts.contact_name, contactName ?? ""),
    });

    return !!existingContact; 
  }

  private async saveContact(contact: Contact): Promise<void> {
    if (
      contact.isGroup ||
      !contact.name ||
      !contact.isMyContact ||
      !contact.isWAContact
    ) {
      return;
    }

    if (await this.isContactExists(contact.name)) {
      return;
    }

    const db = await getDb();
    await db
      .insert(schema.contacts)
      .values({
        user_id: this.userId,
        contact_id: `${contact.id.user}@c.us`,
        contact_name: contact.name,
        is_tracked: false,
      })
      .onConflictDoNothing();
  }

  async saveAllContacts(): Promise<void> {
    try {
      const contacts = await this.client.getContacts();
      await Promise.all(contacts.map((contact) => this.saveContact(contact)));
      console.log("Contacts saved successfully.");
    } catch (error) {
      console.error("Error saving contacts:", error);
    }
  }
}
