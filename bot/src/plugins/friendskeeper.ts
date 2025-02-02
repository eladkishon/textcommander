import { Client, Message, Chat, Contact } from "whatsapp-web.js";
import schedule from "node-schedule";
import { differenceInDays } from "date-fns";
import FileSync from "lowdb/adapters/FileSync";
import { getDb } from "../../../lib/db/db";
import { eq } from "drizzle-orm";
import * as schema from "../../../lib/db/schema";
import { getTrackedFriends } from "../../../lib/db/repository";
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

const CONTACT_INACTIVE_THRESHOLD_IN_DAYS = 30;

export class FriendsKeeperPlugin {
  client?: Client;
  commandChat?: Chat;
  lastUnactiveFriendsChats: { chat: Chat; daysSinceLastMessage: number }[] = [];
  userId: string;

  constructor(userId: string) {
    this.userId = userId;
  }
  async checkForInactiveFriends() {
    if (!this.client) return;
    const chats = await this.client.getChats();
    const friends = chats.filter((chat) => !chat.isGroup);
    const inactiveFriends = [];

    for (const friend of friends) {
      const messages = await friend.fetchMessages({ limit: 50 });
      if (!messages.length) continue;

      const lastMessageDate = new Date(messages.at(-1)!.timestamp * 1000);
      const daysSinceLastMessage = differenceInDays(
        new Date(),
        lastMessageDate
      );

      if (
        daysSinceLastMessage < CONTACT_INACTIVE_THRESHOLD_IN_DAYS &&
        daysSinceLastMessage > 10
      ) {
        inactiveFriends.push({
          chat: friend,
          daysSinceLastMessage,
        });

        // const friendId = friend.id._serialized;
        // db.insert(trackedFriendsTable).values({
        //   user_id: this.userId,
        //   friend_id: friendId,
        // });
        // db.insert()
        // if (db.get("friends").has(friendId).value()) {
        //   db.get("friends")
        //     .set(`${friendId}.lastContacted`, lastMessageDate.toISOString())
        //     .write();
        // }
      }
    }

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
   
    const trackedFriends = await getTrackedFriends(this.userId);

    const trackedFriendsChats = await Promise.all(
      (trackedFriends as unknown as any[]).map(async (friend) => {
        const contact = contacts.find((c) => c.id.user === friend.friend_id);
        if (!contact) return;
        return await contact.getChat();
      })
    );

    for (const trackedFriendChat of trackedFriendsChats) {
      const chat = await trackedFriendChat;
      if (!chat) continue;
      
      const contact = await chat.getContact();
      const friendName = contact.name;

      await chat.sendMessage(
        `Hey ${friendName}, it's been a while! How are you doing?`
      );
    }
  }

  async init(client: Client, commandChat: Chat) {
    this.client = client;
    this.commandChat = commandChat;
    console.log("client", client);
    await this.checkForInactiveFriends();

    schedule.scheduleJob("0 0 * * *", async () => {
      await this.checkForInactiveFriends();
      await this.reachOutToTrackedFriends();
    });

    console.log("FriendsKeeperPlugin initialized");
  }

  async onCommand(command: string) {
    if (command === "friends") {
      console.log("press friends");
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

    const friendsToAdd: { chat: Chat; daysSinceLastMessage: number }[] =
      selectedIndexes.map((i: number) => this.lastUnactiveFriendsChats[i]).filter((f): f is { chat: Chat; daysSinceLastMessage: number } => f !== undefined);
    const db = await getDb();

    for (const friend of friendsToAdd) {
      const friendId = friend.chat.id.user;

      db.insert(schema.trackedFriends).values({
        user_id: this.userId,
        friend_id: friendId,
      });
    }

    if (!this.commandChat) return;
    await this.commandChat.sendMessage(
      `TextCommander💡: Added ${friendsToAdd
        .map((f: { chat: { name: string } }) => f.chat.name)
        .join(", ")} to your keep-in-touch circle.`
    );

    await this.reachOutToTrackedFriends();

    this.lastUnactiveFriendsChats = [];
  }

  async onMessage() {}
  async onCall() {}
}
