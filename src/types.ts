import { Call, Client, Message } from "whatsapp-web.js"

export interface CommanderPlugin {
    init(client: Client): Promise<void>
    onMessage(msg: Message): Promise<void>
    onCall(call: Call): Promise<void>
}