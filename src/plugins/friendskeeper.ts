import { Client, Message, Call, Chat } from "whatsapp-web.js";
import { CommanderPlugin } from "../types";
import schedule = require('node-schedule');
import { differenceInDays, format } from "date-fns";
import FileSync from 'lowdb/adapters/FileSync';
import low from 'lowdb';
const defaultData = { friends: {} }
const adapter = new FileSync('data/friendskeeper.json')
const db = low(adapter)

db.defaults({ friends: {} })
  .write()


export class FriendsKeeperPlugin implements CommanderPlugin {
  
    client: Client;
    commandChat: Chat;
    waitingForReply: boolean;
    lastUnactiveFriendsChats: Chat[]
    db: any;


    private async checkForUnactiveFriends() {
        const chats = await this.client.getChats()

        const friends = chats.filter(c => !c.isGroup)
        const unactiveFriendsChats = []
        // for each friend, get messages, check there are more than 10 messages and the last message is older than 30 days
        for (const friend of friends) {
            const messages = await friend.fetchMessages({ limit: 50 })
            if (messages.length < 10) {
                continue
            }


            const daysDiff = differenceInDays(Date.now(), friend.lastMessage.timestamp * 1000)

            if (daysDiff > 30) {
                // console.log(`Friend ${friend.name} (having ${messages.length}) has not been active for ${daysDiff} days`)
                unactiveFriendsChats.push(friend)
            }
        }


        if (unactiveFriendsChats.length > 0) {
            // format message containing all unactive friends numbered from 1 (for later ref), with name, lastMessage, contacted X days ago
            const message = unactiveFriendsChats.map((c, i) => `${i + 1}.\n ${c.name} \n contacted ${differenceInDays(Date.now(), c.lastMessage.timestamp * 1000)} days ago`).join('\n\n')
            this.commandChat.sendMessage(
                `TextCommander💡: Unactive friends
                
                ${message}
                Reply with the number of the friend you want to add to your keep-in-touch circle, you can specifiy multiple numbers separated by new lines.
                `)
            this.lastUnactiveFriendsChats = unactiveFriendsChats
            this.commandChat.markUnread()
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

    async onCommand(command: string){
        if (this.lastUnactiveFriendsChats) {
            const selectedFriends = command.split('\n').map(n => parseInt(n))
            const friendsToAdd = this.lastUnactiveFriendsChats.filter((c, i) => selectedFriends.includes(i + 1))

            if (friendsToAdd.length > 0) {
                // add friends to the db if they are not already there
                friendsToAdd.forEach(f => {
                    if (!db.get('friends').has(f.id._serialized).value()) {
                        // friends[f.id._serialized] = { name: f.name, added: Date.now() }
                        db.get('friends').set(f.id._serialized, { name: f.name, added: Date.now() }).write()
                    }
                })

                await db.write()
                this.commandChat.sendMessage(`TextCommander💡: Added ${friendsToAdd.map(f => f.name).join(', ')} to your keep-in-touch circle.`)
            }

            this.lastUnactiveFriendsChats = null

        }
    }
    async onMessage(msg: Message) {
    }
    async onCall(call: Call){
    }
}