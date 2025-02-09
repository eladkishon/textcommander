import WAWebJS, {
  Client,
  Chat,
  Message,
  Call,
  MessageMedia,
} from "whatsapp-web.js";
import { CommanderPlugin } from "../types";
import { getWeatherScreenshot } from "../apis/weather_screenshot";
import path from "path";
import { DATA_FOLDER } from "../fs";
import { getContact } from "../apis/user_contacts";

export class ShortcutsPlugin implements CommanderPlugin {
  client?: Client;
  userId?: string;
  commandChat?: Chat;

  async init(userId: string, client: Client, commandChat: Chat) {
    this.client = client;
    this.userId = userId;
    this.commandChat = commandChat;
    console.log("ShortcutsPlugin initialized");
  }
  async onMessage(msg: Message): Promise<void> {}
  async onCall(call: Call): Promise<void> {}

  async onCommand(command: string): Promise<void> {
    if (!this.userId || !this.client) return;

    const pattern = /^weather-(.+)$/;
    const matchWeather = command.match(pattern);

    if (matchWeather) {
      const contactName = matchWeather[1];
      if (!contactName) return;
      try {
        const contact = await getContact(this.client, contactName, this.userId);
        console.log("contact:", contact);

        if (!contact) {
          await this.commandChat?.sendMessage(
            `TextCommander💡: ${contactName} is not a contact.`
          );
          return;
        }
        await getWeatherScreenshot(this.userId);

        const filePath = path.join(DATA_FOLDER, "weather_page_screenshot.png");
        const media = MessageMedia.fromFilePath(filePath);
        const chat = await contact.getChat();
        await this.client.sendMessage(contact.id._serialized, media);
      } catch (error) {
        console.error("Error getting weather screenshot:", error);
      }
    }
  }
}
