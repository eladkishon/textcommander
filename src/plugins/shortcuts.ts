import { Client, Chat, Message, Call, MessageMedia } from "whatsapp-web.js";
import { CommanderPlugin } from "../types";
import fs from 'fs';
import { getWeatherScreenshot } from "../apis/weather_screenshot";
import path from "path";
import { DATA_FOLDER } from "../fs";


export class ShortcutsPlugin implements CommanderPlugin {
    client: Client;

    async init(client: Client, botChat: Chat) {
        this.client = client;
        console.log('ShortcutsPlugin initialized');
    }
    async onMessage(msg: Message): Promise<void> {
        if (msg.body === 'weather') {
            try {
                await getWeatherScreenshot()
                msg.reply('', undefined, { media: MessageMedia.fromFilePath(path.join(DATA_FOLDER, 'weather_page_screenshot.png')) })
            } catch (error) {
                console.error('Error getting weather screenshot:', error)
            }
        }
    }
    async onCall(call: Call): Promise<void> {
    }
    async onCommand(command: string): Promise<void> {

    }

}