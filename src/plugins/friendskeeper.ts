import { Client, Message, Chat, Contact } from "whatsapp-web.js";
import schedule from "node-schedule";
import { differenceInDays } from "date-fns";
import FileSync from "lowdb/adapters/FileSync";
import low from "lowdb";

const adapter = new FileSync("data/friendskeeper.json");
const db = low(adapter);
db.defaults({ friends: {} }).write();

type TrackedFriend = {
    name: string;
    chatId: {
        user: string;
        server: string;
        _serialized: string;
    };
    lastContacted: number;
}

const CONTACT_INACTIVE_THRESHOLD_IN_DAYS = 30;

export class FriendsKeeperPlugin {
    client: Client;
    commandChat: Chat;
    lastUnactiveFriendsChats: { chat: Chat, lastMessage: Message }[] = [];
    db: low.LowdbSync<{ friends: { [key: string]: TrackedFriend } }>;

    constructor() {
        this.db = db;
    }

    async checkForInactiveFriends() {
        const chats = await this.client.getChats();
        const friends = chats.filter((chat) => !chat.isGroup);
        const inactiveFriends = [];

        for (const friend of friends) {
            const messages = await friend.fetchMessages({ limit: 50 });
            if (!messages.length) continue;

            const lastMessageDate = new Date(messages.at(-1).timestamp * 1000);
            const daysSinceLastMessage = differenceInDays(
                new Date(),
                lastMessageDate
            );

            if (daysSinceLastMessage > CONTACT_INACTIVE_THRESHOLD_IN_DAYS) {
                inactiveFriends.push({ chat: friend, lastMessageDate, daysSinceLastMessage });

                const friendId = friend.id._serialized;
                if (db.get("friends").has(friendId).value()) {
                    db.get("friends").set(`${friendId}.lastContacted`, lastMessageDate.toISOString()).write();
                }
            }
        }

        if (inactiveFriends.length) {
            const message = inactiveFriends
                .map(
                    (f, index) =>
                        `${index + 1}. ${f.chat.name}\nLast message: ${f.daysSinceLastMessage} days ago.`
                )
                .join("\n\n");

            await this.commandChat.sendMessage(
                `TextCommander💡: Inactive Friends\n\n${message}\n\nReply with the numbers of the friends to add to your keep-in-touch circle (separated by commas).`
            );

            this.lastUnactiveFriendsChats = inactiveFriends;
        }
    }

    async reachOutToTrackedFriends() {
        const chats = await this.client.getChats();
        const trackedFriends = db.get("friends").value() as { [key: string]: TrackedFriend }
        const trackedFriendsChats = Object.values(trackedFriends).map((friend) => chats.find((chat) => chat.id.user === friend.chatId.user));

        for (const trackedFriendChat of trackedFriendsChats) {
            const friendData = trackedFriends[trackedFriendChat.id.user];
            const lastContactedDate = new Date(friendData.lastContacted);

            const daysSinceLastContact = differenceInDays(
                new Date(),
                lastContactedDate
            );

            if (daysSinceLastContact > CONTACT_INACTIVE_THRESHOLD_IN_DAYS) {
                await trackedFriendChat.sendMessage(
                    `Hey ${friendData.name}, it's been a while! How are you doing?`
                );
            }
        }
    }

    async init(client: Client, commandChat: Chat) {
        this.client = client;
        this.commandChat = commandChat;

        await this.checkForInactiveFriends();

        schedule.scheduleJob("0 0 * * *", async () => {
            await this.checkForInactiveFriends();
            await this.reachOutToTrackedFriends();
        });
    }

    async onCommand(command) {

        if (command === 'friends') {
            await this.checkForInactiveFriends();
            return;
        }

        if (!this.lastUnactiveFriendsChats.length) return;

        const selectedIndexes = command
            .split(",")
            .map((n: string) => parseInt(n.trim(), 10) - 1)
            .filter((i: number) => !isNaN(i) && i >= 0 && i < this.lastUnactiveFriendsChats.length);

        const friendsToAdd: { chat: Chat, lastMessage: Message }[] = selectedIndexes.map((i: number) => this.lastUnactiveFriendsChats[i]);

        for (const friend of friendsToAdd) {
            const friendId = friend.chat.id.user;
            if (!db.get("friends").has(friendId).value()) {
                const messages = await friend.chat.fetchMessages({ limit: 10 });
                const lastContactedAt = messages.length ? new Date(messages.at(-1).timestamp * 1000).toISOString() : '';
                db.get("friends")
                    .set(friendId, {
                        name: friend.chat.name,
                        chatId: friend.chat.id,
                        lastContacted: lastContactedAt
                    })
                    .write();
            }
        }


        await this.commandChat.sendMessage(
            `TextCommander💡: Added ${friendsToAdd
                .map((f: { chat: { name: string } }) => f.chat.name)
                .join(", ")} to your keep-in-touch circle.`
        );

        await this.reachOutToTrackedFriends()

        this.lastUnactiveFriendsChats = [];
    }

    async onMessage() { }
    async onCall() { }
}
