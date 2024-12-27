import { Call, Chat, Contact, Message } from "whatsapp-web.js";
import { Client, LocalAuth } from 'whatsapp-web.js';
import Anthropic from "@anthropic-ai/sdk";
import { EventTracker } from "./event_tracker";
import { CommanderPlugin } from "./commander";

const aiClient = new Anthropic({
    apiKey: process.env['ANTHROPIC_API_KEY'], // This is the default and can be omitted
});


const emergencyContactsSearchTerms = ['miri', 'dad', 'roy']
let emergencyContactsStateById: Record<string, EmergencyContactHandler> = {}

class EmergencyContactHandler {
    contact: Contact;
    eventTracker: EventTracker;
    isEmergencyActive: boolean;
    chat: Chat;
    constructor(contact) {
        this.isEmergencyActive = false
        this.contact = contact
        this.eventTracker = new EventTracker({ maxEvents: 3, timeRangeInHours: 1, onThresholdTriggered: async () => await this.onEmergencyTriggered() })
    }

    async onEmergencyTriggered() {
        console.log('Emergency started...')
        this.isEmergencyActive = true

        if (!this.chat) {
            this.chat = await this.contact.getChat()
        }

        this.chat.sendMessage('הכל בסדר מה נשמע ?')
    }

    async onMessageReceived(msg: Message) {
        console.log('Message receieved: ', msg.body)

        if (this.isEmergencyActive) {
            const response = await aiClient.messages.create({
                max_tokens: 100,
                messages: [{ role: 'user', content: msg.body }],
                model: 'claude-3-5-sonnet-latest',
            });

            console.log(response.content);

            const resMessage = response.content.find(c => c.type == 'text')?.text
            this.chat.sendMessage(resMessage)
        }

    }

    onIncomingCall(call) {
        if (this.isEmergencyActive) {
            return
        }

        this.eventTracker.addEvent()
    }
}


export class EmergencyPlugin implements CommanderPlugin {
    async init(client: Client) {
        console.log('Initializing emergency plugin')
        const contacts = await client.getContacts()
        const emergencyContacts = contacts.filter(c => emergencyContactsSearchTerms.some(ec => c.name?.toLowerCase().includes(ec.toLowerCase())) && c.id.server == 'c.us')
        console.log(`Emergency contacts: `, emergencyContacts.map(c => `${c.name}, ${c.id._serialized}`).join(','))

        emergencyContacts.forEach(c =>
            emergencyContactsStateById[c.id._serialized] = new EmergencyContactHandler(c))
    }
    async onMessage(msg: Message) {
        if (emergencyContactsStateById[msg.from]) {
            await emergencyContactsStateById[msg.from].onMessageReceived(msg)
        }
    }
    async onCall(call: Call) {
        if (emergencyContactsStateById[call.from]) {
            console.log(`Incoming call from ${emergencyContactsStateById[call.from].contact.name}`)
            emergencyContactsStateById[call.from].onIncomingCall(call)

        }
    }

}

