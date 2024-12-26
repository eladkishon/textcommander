const { Client, LocalAuth } = require('whatsapp-web.js');
const { finished } = require('stream/promises'); // Utility for working with streams in async
const fs = require('fs');
const path = require('path');

const qrcode = require('qrcode-terminal');

const client = new Client({
    authStrategy: new LocalAuth()
});

client.on('ready', () => {
    console.log('Client is ready!');
    fullExport()
});

client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
});

client.initialize();


async function fullExport() {
    const chats = await client.getChats()
    console.log(chats)
    const backupDir = 'backup'
    fs.mkdirSync(backupDir, { recursive: true });



  
    // find a specific chat
    const royChat = chats.find(c => c.name = 'Roy Rinkov')


    
    console.log(await royChat.syncHistory())


    console.log(await royChat.fetchMessages({ limit: 1000 }))



    await Promise.all(chats.map(async (chat) => {

        try {

            if (chat.isGroup) {
                return
            }
            console.log('Backing up - ' + chat.name)
            const filePath = path.join(backupDir, chat.name + '.json');

            const historySynced = await chat.syncHistory()

            console.log('history synced: ' + historySynced)

            if (!historySynced) {
                console.error('chat history failed to sync')
                return
            }

            const messages = await chat.fetchMessages({ limit: 99 })
            console.log('Fetched ' + messages.length + ' messages, first one: ' + messages[0].body)
            const backupData = messages.map(msg => ({ text: msg.body, author: msg.author, isMe: msg.fromMe }))
            const writeStream = fs.createWriteStream(filePath);

            writeStream.write(JSON.stringify(backupData, null, 2));
            writeStream.end();

            await finished(writeStream); // Wait for the stream to finish
            console.log('Backup successfull - ' + chat.name);
        } catch (error) {
            console.error('Error writing streamed JSON:', error);
        }
    }))

}

