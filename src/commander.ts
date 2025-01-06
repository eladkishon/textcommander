import { Call, Chat, Client, LocalAuth, Message } from "whatsapp-web.js";
import * as qrcode from 'qrcode-terminal';
import { CommanderPlugin } from "./types";





// Emergency
// Group helper
// Auto Replyer
export class TextCommanderBus {
    plugins: CommanderPlugin[];
    client: Client;
    botChat: Chat;

    constructor(client: Client) {
        this.client = client
        this.plugins = []
    }

    add_plugin(plugin: CommanderPlugin) {
        this.plugins.push(plugin)
    }

    private getTextCommanderChat() {
        return this.client.getChats().then(chats => chats.find(c => c.isGroup && c.name === 'TextCommander'))
    }


    async start() {
        console.log('Initilizing.')

        this.client.on('qr', qr => {
            qrcode.generate(qr, { small: true });
        });

        this.client.on('message_create', async (m) => {
            const chat = await m.getChat()
            if (chat.isGroup && chat.name === 'TextCommander' ) {
                if (!m.body.startsWith('TextCommander')) {
                    await Promise.all(this.plugins.map(p => p.onCommand(m.body)))
                }
                return
            }
            await Promise.all(this.plugins.map(p => p.onMessage(m)))
        })

        this.client.on('message', async (m) => {
            console.log('Message received.', m.body)

            await Promise.all(this.plugins.map(p => p.onMessage(m)))
        })

        this.client.on('call', async (c) => {
            await Promise.all(this.plugins.map(p => p.onCall(c)))
        })

        this.client.initialize()


        return new Promise<void>((resolve) => {
            this.client.once('ready', async () => {
                console.log('Client is ready.')
                this.botChat = await this.getTextCommanderChat()

                if (!this.botChat) {
                    const res = await this.client.createGroup('TextCommander', [])
                    this.botChat = await this.getTextCommanderChat()
                }

                if (!this.botChat) {
                    console.error('Could not create or find TextCommander group.')
                    return
                }

                await Promise.all(this.plugins.map(p => p.init(this.client, this.botChat)))
                resolve()
            })
        })
    }
}




