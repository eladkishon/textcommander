import { Client, Message, Call, GroupChat, Chat } from "whatsapp-web.js";
import { CommanderPlugin } from "../types";
const { setTimeout } = require('timers/promises');
import fs = require('fs/promises');
import inquirer from "inquirer";


async function asyncFilter(array, predicate): Promise<Array<any>> {
    // const results = await Promise.all(array.map(predicate));
    const results = []
    for (const item of array) {
        results.push(await predicate(item))
    }
    return array.filter((_, index) => results[index]);

}


export class ChatCleanerPlugin implements CommanderPlugin {
    private async deleteChatsWithConfirmation(categoryName:string, chats: Chat[]) {

        if (chats.length === 0) {
            console.log(`No ${categoryName} chats found.`)
            return
        }

        const deletionCandidatesData = chats.map(c => ({ id: c.id._serialized, name: c.name, isGroup: c.isGroup, isArchived: c.archived }))

        await fs.writeFile(`${categoryName}_deletion_candidates.json`, JSON.stringify(deletionCandidatesData, null, 2))

        const {isDelete} = await inquirer
            .prompt([
                {
                    type: 'confirm',
                    name: 'isDelete',
                    message: `Do you want to delete ${chats.length} ${categoryName} chats? \n(View deletion candidates in ${categoryName}_deletion_candidates.json)`,
                    default: false, // Default answer is "No"
                },
            ])
        
        if (isDelete) { 
            const deletionPromises = chats.map(c => c.delete())
            await Promise.all(deletionPromises)
            console.log('Deletion completed.')
        }

    }
    async init(client: Client): Promise<void> {
        const myNumber = client.info.wid.user
        console.log('Starting chat cleaner')
        const chats = await client.getChats()

        const archivedChats = chats.filter(c => c.archived)

        console.log(`Found ${archivedChats.length} archived chats.`)
        fs.writeFile('archived_chats.json', JSON.stringify(archivedChats.map(c => ({ id: c.id._serialized, name: c.name, isGroup: c.isGroup })), null, 2))

        // for (const chat of archivedChats) {
        //     await chat.syncHistory()
        // }

        // ===== Exited groups =====
        const exitedGroups = archivedChats.filter(c => c.isGroup && !(c as GroupChat).participants.map(p => p.id.user).includes(myNumber))
        
        await this.deleteChatsWithConfirmation('exited_groups', exitedGroups)

        const phoneRegex = /^[\u202A]?\+?[1-9]\d{0,2}[\s-]?(\(\d{1,4}\)|\d{1,4})[\s-]?(\d{1,4}[\s-]?){1,3}[\u202C]?$/;

        const unsavedContactChats = archivedChats.filter(c => phoneRegex.test(c.name))

        await this.deleteChatsWithConfirmation('unsaved_contact_chats', unsavedContactChats)
        
    }
    async onMessage(msg: Message): Promise<void> {

    }
    async onCall(call: Call): Promise<void> {

    }

}