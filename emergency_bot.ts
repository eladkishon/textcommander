import { Contact } from "whatsapp-web.js";
import { Client, LocalAuth } from 'whatsapp-web.js';
import * as qrcode from 'qrcode-terminal';


const client = new Client({
    authStrategy: new LocalAuth(),
    // puppeteer: {
    //     args: ['--no-sandbox', '--disable-setuid-sandbox'],
    // }
});

// queue buckets, every bucket is an hour add messages the latest hour
// clean last message in queue every hour 

const emergencyContactsSearchTerms = ['miri', 'dad']
let emergencyContactsById: Record<string, Contact> = {}

client.once('ready', async () => {
    console.log('Client is ready!');
    const contacts = await client.getContacts()
    const emergencyContacts = contacts.filter(c => emergencyContactsSearchTerms.some(ec => c.name?.toLowerCase().includes(ec.toLowerCase())) && c.id.server == 'c.us')
    console.log(`Emergency contacts: `, emergencyContacts.map(c => c.name).join(','))

    emergencyContacts.forEach(c => emergencyContactsById[c.id._serialized] = c)

    console.log(emergencyContactsById)
});

client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
});

client.on('message', msg => {
    console.log('message recieved', msg.from, msg.author)
    if (emergencyContactsById[msg.from]) {
        console.log(`Message received from ${emergencyContactsById[msg.from].name}`)
        console.log('body: ' + msg.body)

    }
})

client.on('call', call => {
    if (emergencyContactsById[call.from]) {
        console.log(`Incoming call from ${emergencyContactsById[call.from].name}`)
    }

    // add event to event queue
    // if in a time frame of say 6 hours more than X calls and more then Y messages
    // Start emergency mode - preconfig message/AI response. 
    // Limit X amount of messages sent 
})

console.log('Initializing...')
client.initialize();
