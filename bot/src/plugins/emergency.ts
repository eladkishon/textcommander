import { Call, Chat, Contact, Message } from "whatsapp-web.js";
import { Client, LocalAuth } from 'whatsapp-web.js';
import Anthropic from "@anthropic-ai/sdk";
import { EventTracker } from "../utils/event_tracker";
import { CommanderPlugin } from "../types";

const aiClient = new Anthropic({
    apiKey: process.env['ANTHROPIC_API_KEY'], // This is the default and can be omitted
});


const emergencyContactsSearchTerms = ['miri', 'dad', 'roy']
let emergencyContactsStateById: Record<string, EmergencyContactHandler> = {}

const personalityPrompt =
    `
אתה מתכתב בשמי אלעד בהודעות, דובר עברית מדבר בצורה יחסית קצרה, ההודעות הם קצרות ולעניין, אתה צריך להתכתב בצורה אנושית ולכתוב הודעות הגיוניות וקצרות 
אל תכתוב דברים ספציפיים מידי שיכולים להתברר כלא נכונים
אל תמציא מידע לא נכון, לדוגמא, אם שואלים משהו ספציפי כמו מה אתה עושה תנסה להתחמק מהשאלה או לתת משהו שכל אדם יכול לעשות כך שאף אחד לא יחשוד שמה שאתה אומר הוא לא נכון
`

class EmergencyContactHandler {
    contact: Contact;
    eventTracker: EventTracker;
    isEmergencyActive: boolean;
    chat: Chat;
    messagesCount: number
    maxEmergencyResponseMessages: number;
    emergencyFirstResponse: string;
    constructor({contact, emergencyDefaultResponse }) {
        this.isEmergencyActive = false
        this.contact = contact
        this.messagesCount = 0
        this.maxEmergencyResponseMessages = 10
        this.emergencyFirstResponse = emergencyDefaultResponse
        this.eventTracker = new EventTracker({ maxEvents: 3, timeRangeInHours: 1, onThresholdTriggered: async () => await this.onEmergencyTriggered() })
    }

    async onEmergencyTriggered() {
        console.log('Emergency session started.')
        this.isEmergencyActive = true

        if (!this.chat) {
            this.chat = await this.contact.getChat()
        }

        this.chat.sendMessage(this.emergencyFirstResponse)

        setTimeout(() => {
            this.isEmergencyActive = false
            console.log('Emergency session stopped.')
        }, 1000 * 60 * 60)
    }

    async onMessageReceived(msg: Message) {
        if (this.isEmergencyActive && this.messagesCount < this.maxEmergencyResponseMessages) {
            console.log('Emergency Plugin: Message receieved - ', msg.body)

            const response = await aiClient.messages.create({
                max_tokens: 100,
                system: personalityPrompt,
                messages: [{ role: 'user', content: msg.body }],
                model: 'claude-3-5-sonnet-latest',
            });

            const resMessage = response.content.find(c => c.type == 'text')?.text
            this.chat.sendMessage(resMessage)
            this.messagesCount += 1
        }

    }

    onIncomingCall(call) {
        if (this.isEmergencyActive) {
            return
        }

        this.eventTracker.addEvent()
    }
}


const DEFAULT_EMERGE_RESP = 'היי מה נשמע ?'

export class EmergencyPlugin implements CommanderPlugin {
   
    async init(client: Client) {
        console.log('Initializing emergency plugin')
        const contacts = await client.getContacts()
        const emergencyContacts = contacts.filter(c => emergencyContactsSearchTerms.some(ec => c.name?.toLowerCase().includes(ec.toLowerCase())) && c.id.server == 'c.us')
        console.log(`Emergency contacts: `, emergencyContacts.map(c => `${c.name}, ${c.id._serialized}`).join(','))

        emergencyContacts.forEach(c =>
            emergencyContactsStateById[c.id._serialized] = new EmergencyContactHandler({contact:c, emergencyDefaultResponse: DEFAULT_EMERGE_RESP}))
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
    onCommand(command: string): Promise<void> {
        return 
    }
}

