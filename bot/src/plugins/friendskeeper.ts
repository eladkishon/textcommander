import { Client, Message, Chat, Contact } from "whatsapp-web.js";
import schedule from "node-schedule";
import { differenceInDays } from "date-fns";
import { getDb } from "../../../lib/db/db";
import * as schema from "../../../lib/db/schema";
import { eq } from "drizzle-orm";
import { and } from "drizzle-orm";

const CONTACT_INACTIVE_THRESHOLD_IN_DAYS = 1;

type TrackedFriend = {
  id: number;
  user_id: string;
  contact_id: string;
  contact_name: string;
  created_at: Date | null;
  is_tracked: boolean;
};

export class FriendsKeeperPlugin {
  client?: Client;
  commandChat?: Chat;
  userId?: string;
  trackedFriends: TrackedFriend[] = [];
  lastInactiveFriends: { chat: Chat; daysSinceLastMessage: number }[] = [];
  selectedChatsToSendMessage: Chat[] = [];

  async getTrackedFriends() {
    if (!this.userId) return [];
    const db = await getDb();

    console.log("DB Query Object:", db.query);
    console.log("DB Contacts Object:", db.query.contacts);

    if (!db.query || !db.query.contacts) {
        console.error("DB query or contacts object is undefined");
        return [];
    }

    return await db.query.contacts.findMany({
      where: and(
        eq(schema.contacts.user_id, this.userId),
        eq(schema.contacts.is_tracked, true)
      ),
    });
  }

  private async getInactiveFriends() {
    if (!this.client) return [];

    const inactiveFriends: { chat: Chat; daysSinceLastMessage: number }[] = [];
    console.log(this.trackedFriends);
    for (const friend of this.trackedFriends) {
      const friendContact = await this.client.getContactById(friend.contact_id);
      const friendChat = await friendContact.getChat();
      const messages = await friendChat.fetchMessages({ limit: 50 });
      if (!messages.length) continue;

      const lastMessageDate = new Date(messages.at(-1)!.timestamp * 1000);
      const daysSinceLastMessage = differenceInDays(
        new Date(),
        lastMessageDate
      );
      if (daysSinceLastMessage > CONTACT_INACTIVE_THRESHOLD_IN_DAYS) {
        inactiveFriends.push({ chat: friendChat, daysSinceLastMessage });
      }
    }

    return inactiveFriends;
  }

  async handleInactiveFriendsCheck() {
    if (!this.client) return;

    this.trackedFriends = await this.getTrackedFriends();

    if (this.trackedFriends.length === 0) {
      await this.commandChat?.sendMessage(
        `TextCommander💡: You don't track any friends.`
      );
      return;
    }

    const inactiveFriends = await this.getInactiveFriends();
    console.log(inactiveFriends);
    if (inactiveFriends.length > 0) {
      await this.notifyInactiveFriends(inactiveFriends);
      this.lastInactiveFriends = inactiveFriends;
    } else {
      await this.commandChat?.sendMessage(
        `TextCommander💡: You're doing amazing! 🌟 You've kept in touch with all your tracked friends. Keep up the great work! 💬❤️`
      );
    }
  }

  private async notifyInactiveFriends(
    inactiveFriends: { chat: Chat; daysSinceLastMessage: number }[]
  ) {
    const message = inactiveFriends
      .map(
        (f, index) =>
          `${index + 1}. ${f.chat.name} (Last message: ${
            f.daysSinceLastMessage
          } days ago)`
      )
      .join("\n\n");

    await this.commandChat?.sendMessage(
      `TextCommander💡: Inactive Friends\n\n${message}\n\nReply with the numbers of the friends to send them a hello message (separated by commas).`
    );
  }

  async sendMessageConfirm() {
    if (!this.selectedChatsToSendMessage.length) return;

    await this.commandChat?.sendMessage(
      `TextCommander💡: I'm going to send ${this.selectedChatsToSendMessage
        .map((chat) => chat.name)
        .join(",")} hello message. Reply with 'send hello' if you confirm.`
    );
  }

  private async reachOutToSelectedFriends() {
    if (!this.client) return;

    for (const chat of this.selectedChatsToSendMessage) {
      const contact = await chat.getContact();
      await chat.sendMessage(
        `Hey ${contact.name}, it's been a while! How are you doing?`
      );
    }

    // Reset selected chats after sending messages
    this.selectedChatsToSendMessage = [];
    this.lastInactiveFriends = [];
  }

  async init(userId: string, client: Client, commandChat: Chat) {
    this.client = client;
    this.commandChat = commandChat;
    this.userId = userId;
    this.trackedFriends = await this.getTrackedFriends();
    await this.handleInactiveFriendsCheck();

    schedule.scheduleJob("0 0 * * *", async () => {
      await this.handleInactiveFriendsCheck();
      await this.reachOutToSelectedFriends();
    });

    console.log("FriendsKeeperPlugin initialized");
  }

  async onCommand(command: string) {
    if (command === "friends") {
      await this.handleInactiveFriendsCheck();
      return;
    }
    if (!this.lastInactiveFriends.length) return;

    if (command === "send hello") {
      await this.reachOutToSelectedFriends();
      return;
    }
    this.processFriendSelection(command);
  }

  private async processFriendSelection(command: string) {
    const selectedIndexes = command
      .split(",")
      .map((n) => parseInt(n.trim(), 10) - 1)
      .filter(
        (i) => !isNaN(i) && i >= 0 && i < this.lastInactiveFriends.length
      );

    this.selectedChatsToSendMessage = selectedIndexes.map(
      (i) => this.lastInactiveFriends[i]!.chat
    );
    await this.sendMessageConfirm();
  }

  async onMessage() {}
  async onCall() {}
}
