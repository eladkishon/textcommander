import { Client, Message, Chat, Contact } from "whatsapp-web.js";
import schedule from "node-schedule";
import { differenceInDays } from "date-fns";
import FileSync from "lowdb/adapters/FileSync";
import { getDb } from "../../../lib/db/db";
import { and, eq } from "drizzle-orm";
import * as schema from "../../../lib/db/schema";
// const adapter = new FileSync("data/friendskeeper.json");
//low(adapter);
// db.defaults({ friends: {} }).write();

type TrackedFriend = {
  name: string;
  chatId: {
    user: string;
    server: string;
    _serialized: string;
  };
  lastContacted: number;
};

const CONTACT_INACTIVE_THRESHOLD_IN_DAYS = 0;

export class FriendsKeeperPlugin {
  client?: Client;
  commandChat?: Chat;
  lastUnactiveFriendsChats: { chat: Chat; daysSinceLastMessage: number }[] = [];
  friendsChatsToSendMessage: Chat[] = [];
  userId: string;

  constructor(userId: string) {
    this.userId = userId;
  }
  async checkForInactiveFriends() {
    if (!this.client) return;
    const inactiveFriends = [];
    const db = await getDb();

    // const tracked_friends = await db.query.contacts.findMany({
    //   where: (user_contacts, { eq, and }) =>
    //     and(eq(user_contacts.user_id, this.userId), eq(user_contacts.is_tracked, true)),
    // });

    const tracked_friends = await db
      .select()
      .from(schema.contacts)
      .where(
        and(
          eq(schema.contacts.user_id, this.userId),
          eq(schema.contacts.is_tracked, true)
        )
      );

    console.log("tracked_friends", tracked_friends);

    for (const friend of tracked_friends) {
      const friend_contact = await this.client.getContactById(
        `${friend.contact_id}@c.us`
      );
      console.log("friend_contact", friend_contact);
      const friend_chat = await friend_contact.getChat();
      console.log("friend_chat", friend_chat);
      const messages = await friend_chat.fetchMessages({ limit: 50 });
      if (!messages.length) continue;

      const lastMessageDate = new Date(messages.at(-1)!.timestamp * 1000);
      const daysSinceLastMessage = differenceInDays(
        new Date(),
        lastMessageDate
      );
      console.log("daysSinceLastMessage", daysSinceLastMessage);
      if (daysSinceLastMessage > CONTACT_INACTIVE_THRESHOLD_IN_DAYS) {
        inactiveFriends.push({
          chat: friend_chat,
          daysSinceLastMessage,
        });
      }
    }
    console.log("inactiveFriends", inactiveFriends);
    if (inactiveFriends.length) {
      const message = inactiveFriends
        .map(
          (f, index) =>
            `${index + 1}. ${f.chat.name}\nLast message: ${
              f.daysSinceLastMessage
            } days ago.`
        )
        .join("\n\n");

      await this.commandChat?.sendMessage(
        `TextCommander💡: Inactive Friends\n\n${message}\n\nReply with the numbers of the friends to add to your keep-in-touch circle (separated by commas).`
      );

      this.lastUnactiveFriendsChats = inactiveFriends;
    }
  }

  async reachOutToTrackedFriends() {
    if (!this.client || !this.commandChat) return;
    const contacts = await this.client.getContacts(); // Get all contacts

    // const trackedFriendsChats = await Promise.all(
    //   (trackedFriends as unknown as any[]).map(async (friend) => {
    //     const contact = contacts.find((c) => c.id.user === friend.friend_id);
    //     if (!contact) return;
    //     return await contact.getChat();
    //   })
    // );

    for (const trackedFriendChat of this.friendsChatsToSendMessage) {
      const contact = await trackedFriendChat.getContact();
      const friendName = contact.name;

      await trackedFriendChat.sendMessage(
        `Hey ${friendName}, it's been a while! How are you doing?`
      );
    }
  }

  async init(client: Client, commandChat: Chat) {
    this.client = client;
    this.commandChat = commandChat;
    // console.log("client", client);
    await this.checkForInactiveFriends();

    schedule.scheduleJob("0 0 * * *", async () => {
      await this.checkForInactiveFriends();
      await this.reachOutToTrackedFriends();
    });

    console.log("FriendsKeeperPlugin initialized");
  }

  async onCommand(command: string) {
    if (command === "friends") {
      await this.checkForInactiveFriends();
      return;
    }

    if (!this.lastUnactiveFriendsChats.length) return;

    const selectedIndexes = command
      .split(",")
      .map((n: string) => parseInt(n.trim(), 10) - 1)
      .filter(
        (i: number) =>
          !isNaN(i) && i >= 0 && i < this.lastUnactiveFriendsChats.length
      );

    const friendsToSendMessage: { chat: Chat; daysSinceLastMessage: number }[] =
      selectedIndexes
        .map((i: number) => this.lastUnactiveFriendsChats[i])
        .filter(
          (f): f is { chat: Chat; daysSinceLastMessage: number } =>
            f !== undefined
        );

    // if (!this.commandChat) return;
    // await this.commandChat.sendMessage(
    //   `TextCommander💡: Added ${friendsToAdd
    //     .map((f: { chat: { name: string } }) => f.chat.name)
    //     .join(", ")} to your keep-in-touch circle.`
    // );
    console.log("friendsToSendMessage", friendsToSendMessage);
    this.friendsChatsToSendMessage = friendsToSendMessage.map(
      (obj) => obj.chat
    );
    console.log("friendsToSendMessageChats", this.friendsChatsToSendMessage);
    await this.reachOutToTrackedFriends();

    this.lastUnactiveFriendsChats = [];
  }

  async onMessage() {}
  async onCall() {}
}
