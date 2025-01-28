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
import { getBirthdayWish } from "../apis/birthday_wish";

export class ShortcutsPlugin implements CommanderPlugin {
  client: Client;

  async init(client: Client, botChat: Chat) {
    this.client = client;
    console.log("ShortcutsPlugin initialized");
  }
  async onMessage(msg: Message): Promise<void> {
    const userId = "user_2roH7uYsYk5m4ORVmNkCw7KLqrh";

    if (msg.body === "weather") {
      try {
        const contact = await msg.getContact();
        if (contact.isMe) {
          const chat = await msg.getChat();
          const recipientContact = (await chat.getContact()).name;

          console.log("Recipient Contact:", recipientContact);
        }
        await getWeatherScreenshot(userId);
        msg.reply("", undefined, {
          media: MessageMedia.fromFilePath(
            path.join(DATA_FOLDER, "weather_page_screenshot.png")
          ),
        });
      } catch (error) {
        console.error("Error getting weather screenshot:", error);
      }
    } else if (msg.body === "bday") {
      try {
        const contact = await msg.getContact();
        if (contact.isMe) {
          const chat = await msg.getChat();
          const recipientContact = (await chat.getContact()).name;

          console.log("Recipient Contact:", recipientContact);
          const birthdayWish = await getBirthdayWish(userId, recipientContact);

          console.log(birthdayWish);
          msg.reply(birthdayWish);
        }
      } catch (error) {
        console.error("Error getting weather screenshot:", error);
      }
    }
  }
  async onCall(call: Call): Promise<void> {}
  async onCommand(command: string): Promise<void> {}
}
