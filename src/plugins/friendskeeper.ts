import { Client, Message, Call } from "whatsapp-web.js";
import { CommanderPlugin } from "../types";



export class FriendsKeeperPlugin implements CommanderPlugin {
    init(client: Client): Promise<void> {
        throw new Error("Method not implemented.");
    }
    onMessage(msg: Message): Promise<void> {
        throw new Error("Method not implemented.");
    }
    onCall(call: Call): Promise<void> {
        throw new Error("Method not implemented.");
    }
}