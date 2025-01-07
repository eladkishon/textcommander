import { Client, Message, Call, Chat } from "whatsapp-web.js";
import { CommanderPlugin } from "../types";
import schedule = require('node-schedule');
import { differenceInDays, format } from "date-fns";
import FileSync from 'lowdb/adapters/FileSync';
import low from 'lowdb';
const adapter = new FileSync('data/friendskeeper.json')
const db = low(adapter)

const defaultData = { friends: {} }
db.defaults(defaultData).write()

export class FriendsKeeperPlugin implements CommanderPlugin {

    client: Client;
    commandChat: Chat;
    waitingForReply: boolean;
    lastUnactiveFriendsChats: {chat: Chat, messages: Message[]}[]
    db: any;


    private async checkForUnactiveFriends() {
        const chats = await this.client.getChats()

        const friends = chats.filter(c => !c.isGroup)
        const unactiveFriendsChats = []

        for (const friend of friends) {
            const messages = await friend.fetchMessages({ limit: 50 })
            if (messages.length < 10) {
                continue
            }

            const lastMessage = messages.at(-1)

            const daysDiff = differenceInDays(Date.now(), lastMessage.timestamp * 1000)

            if (daysDiff > 1) {
                // console.log(`Friend ${friend.name} (having ${messages.length}) has not been active for ${daysDiff} days`)
                unactiveFriendsChats.push({chat: friend, messages: messages})
                // update lastContacted in db only if the friend is already in the db
                if (db.get('friends').has(friend.id.user).value()) {
                    db.get('friends').set(`${friend.id.user}.lastContacted`, lastMessage.timestamp * 1000).write()
                }
            }
        }

        if (unactiveFriendsChats.length) {
            // format message containing all unactive friends numbered from 1 (for later ref), with name, lastMessage, contacted X days ago
            const message = unactiveFriendsChats.map(({chat:c, messages}, i) => `${i + 1}.\n ${c.name} \n contacted ${differenceInDays(Date.now(), messages.at(-1).timestamp * 1000)} days ago`).join('\n\n')
            this.commandChat.sendMessage(
                `TextCommander💡: Unactive friends
                
                ${message}
                Reply with the number of the friend you want to add to your keep-in-touch circle, you can specifiy multiple numbers separated by new lines.
                `)
            this.lastUnactiveFriendsChats = unactiveFriendsChats
            this.commandChat.markUnread()
        }


       await this.reachOutToUnactiveFriends()

    }
    async reachOutToUnactiveFriends() {
        // for every tracked friend, send a predefined message
        const trackedFriends = db.get('friends').value()
        for (const friend of trackedFriends) {
            // check last contacted more than 30 days ago
            if (differenceInDays(Date.now(), friend.lastContacted) < 30) {
                continue
            }
            const chat = await this.client.getChatById(friend.id)
            chat.sendMessage(`Hey ${friend.name}, it's been a while since we last talked. How are you doing?`)
        }
    }

    async init(client: Client, commandChat: Chat) {
        this.client = client
        this.commandChat = commandChat

        // run now and every day same time
        this.checkForUnactiveFriends()

        // check for unactive friends every day using node-schedule
        const rule = new schedule.RecurrenceRule();
        const now = new Date();
        rule.hour = now.getHours()
        rule.minute = now.getMinutes()

        schedule.scheduleJob(rule, async () => {
            await this.checkForUnactiveFriends()
        })
    }

    async onCommand(command: string) {
        if (this.lastUnactiveFriendsChats) {
            const selectedFriends = command.split('\n').map(n => parseInt(n))
            const friendsToAdd = this.lastUnactiveFriendsChats.filter((c, i) => selectedFriends.includes(i + 1))

            if (friendsToAdd.length > 0) {
                // add friends to the db if they are not already there
                friendsToAdd.forEach(f => {
                    if (!db.get('friends').has(f.chat.id._serialized).value()) {
                        db.get('friends').set(f.chat.id.user, { name: f.chat.name, added: Date.now(), chatId: f.chat.id, lastContacted: Date.now()})
                        .write()
                    }
                })

                this.commandChat.sendMessage(`TextCommander💡: Added ${friendsToAdd.map(f => f.chat.name).join(', ')} to your keep-in-touch circle.`)
            }
            this.lastUnactiveFriendsChats = null
            this.reachOutToUnactiveFriends()
        }
    }
    async onMessage(msg: Message) {
    }
    async onCall(call: Call) {
    }
}