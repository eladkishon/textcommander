import { Call, Chat, Client, Message } from "whatsapp-web.js"

export interface CommanderPlugin {
    init(client: Client, botChat: Chat): Promise<void>
    onMessage(msg: Message): Promise<void>
    onCall(call: Call): Promise<void>
    onCommand(command: string): Promise<void>
}