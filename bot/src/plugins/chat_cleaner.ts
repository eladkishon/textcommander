import { Client, Message, Call, GroupChat, Chat } from "whatsapp-web.js";
import { CommanderPlugin } from "../types";
import fs = require('fs/promises');
import inquirer from "inquirer";
import schedule = require('node-schedule');
import { DATA_FOLDER } from "../fs";
import path = require("path");



export class ChatCleanerPlugin implements CommanderPlugin {
   
    client: Client;


    async init(client: Client): Promise<void> {
        console.log('Starting chat cleaner')
        this.client = client

        await this.deleteChats()


        const rule = new schedule.RecurrenceRule();
        const now = new Date();
        rule.hour = now.getHours()
        rule.minute = now.getMinutes()

        schedule.scheduleJob(rule, async () => {
            console.log('Running scheduled job')
            await this.deleteChats()
        })
    }


    private async deleteChats() {
        const myNumber = this.client.info.wid.user
        const chats = await this.client.getChats()

        const archivedChats = chats.filter(c => c.archived)

        for (const chat of archivedChats) {
            await chat.syncHistory()
        }

        // console.log(`Found ${archivedChats.length} archived chats.`)
        // fs.writeFile('archived_chats.json', JSON.stringify(archivedChats.map(c => ({ id: c.id._serialized, name: c.name, isGroup: c.isGroup })), null, 2))

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

    private async deleteChatsWithConfirmation(categoryName: string, chats: Chat[]) {

        if (chats.length === 0) {
            // console.log(`No ${categoryName} chats found.`)
            return
        }

        const deletionCandidatesData = chats.map(c => ({ id: c.id._serialized, name: c.name, isGroup: c.isGroup, isArchived: c.archived }))

        await fs.writeFile(path.join(DATA_FOLDER,`${categoryName}_deletion_candidates.json`), JSON.stringify(deletionCandidatesData, null, 2))

        const { isDelete } = await inquirer
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

    onCommand(command: string): Promise<void> {
        return 
    }

}