import { Client, Message, Call } from "whatsapp-web.js";
import { CommanderPlugin } from "../types";
import schedule = require('node-schedule');
import { differenceInDays, format } from "date-fns";


export class FriendsKeeperPlugin implements CommanderPlugin {
    client: Client;

    private async checkForUnactiveFriends() {
        const chats = await this.client.getChats()

        const friends = chats.filter(c => !c.isGroup)

        // for each friend, get messages, check there are more than 10 messages and the last message is older than 30 days
        for (const friend of friends) {
            const messages = await friend.fetchMessages({ limit: 50 })
            if (messages.length < 10) {
                continue
            }


            const daysDiff = differenceInDays(Date.now(), friend.lastMessage.timestamp * 1000)
            
            if (daysDiff > 30) {
                console.log(`Friend ${friend.name} (having ${messages.length}) has not been active for ${daysDiff} days`)
            }
        }



    }
    async init(client: Client) {
        this.client = client

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
    onMessage(msg: Message): Promise<void> {
        throw new Error("Method not implemented.");
    }
    onCall(call: Call): Promise<void> {
        throw new Error("Method not implemented.");
    }
}