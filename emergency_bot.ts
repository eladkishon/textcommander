import { Chat, Contact, Message } from "whatsapp-web.js";
import { Client, LocalAuth } from 'whatsapp-web.js';
import * as qrcode from 'qrcode-terminal';
import { EventTracker } from "./event_tracker";
import Anthropic from "@anthropic-ai/sdk";

const aiClient = new Anthropic({
    apiKey: process.env['ANTHROPIC_API_KEY'], // This is the default and can be omitted
});
const client = new Client({
    authStrategy: new LocalAuth(),
    // puppeteer: {
    //     args: ['--no-sandbox', '--disable-setuid-sandbox'],
    // }
});

const emergencyContactsSearchTerms = ['miri', 'dad']
let emergencyContactsStateById: Record<string, EmergencyContactCommander> = {}


export class EmergencyContactCommander {
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

        if (this.isEmergencyActive) {
            const response = await aiClient.messages.create({
                max_tokens: 1024,
                messages: [{ role: 'user', content: msg.body }],
                model: 'claude-3-5-sonnet-latest',
            });

            console.log(response.content);
            this.chat.sendMessage(response.content.toString())
        }

    }

    onIncomingCall(call) {
        if (this.isEmergencyActive) {
            return
        }

        this.eventTracker.addEvent()
    }
}

client.once('ready', async () => {
    console.log('Client is ready!');
    const contacts = await client.getContacts()
    const emergencyContacts = contacts.filter(c => emergencyContactsSearchTerms.some(ec => c.name?.toLowerCase().includes(ec.toLowerCase())) && c.id.server == 'c.us')
    console.log(`Emergency contacts: `, emergencyContacts.map(c => c.name).join(','))

    emergencyContacts.forEach(c =>
        emergencyContactsStateById[c.id._serialized] = new EmergencyContactCommander(c))
});

client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
});

client.on('message', msg => {
    console.log('message recieved', msg.from, msg.author)
    if (emergencyContactsStateById[msg.from]) {
        console.log(`Message received from ${emergencyContactsStateById[msg.from].contact.name}`)
        console.log('body: ' + msg.body)
        emergencyContactsStateById[msg.from].onMessageReceived(msg)
    }
})

client.on('call', call => {
    if (emergencyContactsStateById[call.from]) {
        console.log(`Incoming call from ${emergencyContactsStateById[call.from].contact.name}`)
        emergencyContactsStateById[call.from].onIncomingCall(call)

    }

    // add event to event queue
    // if in a time frame of say 6 hours more than X calls and more then Y messages
    // Start emergency mode - preconfig message/AI response. 
    // Limit X amount of messages sent 
})

console.log('Initializing...')
client.initialize();
