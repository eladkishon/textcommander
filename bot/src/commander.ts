import WAWebJS, {
  Call,
  Chat,
  Client,
  LocalAuth,
  Message,
} from "whatsapp-web.js";
import * as qrcode from "qrcode-terminal";
import { CommanderPlugin } from "./types";
import { getDb } from "../../shared/db/db";
import { userConfigTable } from "../../shared/db/schema";
// Emergency
// Group helper
// Auto Replyer

export class TextCommanderBus {
  plugins: CommanderPlugin[];
  client: Client;
  botChat: Chat;
  userId: string;

  constructor(client: Client, userId: string) {
    this.client = client;
    this.plugins = [];
    this.userId = userId;
    // this.botChat = undefined;
  }
  add_plugin(plugin: CommanderPlugin) {
    this.plugins.push(plugin);
  }

  private getTextCommanderChat() {
    return this.client
      .getChats()
      .then((chats) =>
        chats.find((c) => c.isGroup && c.name === "TextCommander")
      );
  }

  async start() {
    this.client.on("message_create", async (m) => {
      const chat = await m.getChat();
      if (chat.isGroup && chat.name === "TextCommander") {
        if (!m.body.startsWith("TextCommander")) {
          await Promise.all(this.plugins.map((p) => p.onCommand(m.body)));
        }
        return;
      }
      await Promise.all(this.plugins.map((p) => p.onMessage(m)));
    });

    this.client.on("message", async (m) => {
      // console.log("Message received.", m.body);

      await Promise.all(this.plugins.map((p) => p.onMessage(m)));
    });

    this.client.on("call", async (c) => {
      await Promise.all(this.plugins.map((p) => p.onCall(c)));
    });

    this.client.initialize();

    return new Promise<void>((resolve, reject) => {
      this.client.once("ready", async () => {
        console.log("Client is ready.");
        const db = await getDb();

        // await db
        //   .insert(userConfigTable)
        //   .values({ user_id: this.userId, is_initialized: true })
        //   .onConflictDoNothing();

        // const insertContact = async (chat: Chat) => {
        //   console.log((await chat.getContact()).name);
        //   await db
        //     .insert(contactsTable)
        //     .values({
        //       user_id: this.userId,
        //       contact_id: (await chat.getContact()).name!,
        //     })
        //     .onConflictDoNothing();
        // };

        // (await this.client.getChats()).forEach(insertContact);
        console.log("test");
        try {
          // Ensure botChat is initialized, retrying if necessary
          this.botChat = await retryOperation(async () => {
            let chat = await this.getTextCommanderChat();
            if (!chat) {
              await this.client.createGroup("TextCommander", []);
              chat = await this.getTextCommanderChat();
            }
            if (!chat) {
              throw new Error("Could not create or find TextCommander group.");
            }
            return chat;
          }, 5); // Retry up to 5 times

          // Ensure all plugins are initialized, retrying each plugin if needed
          await Promise.all(
            this.plugins.map((p) =>
              retryOperation(
                async () => await p.init(this.client, this.botChat),
                3 // Retry each plugin up to 3 times
              )
            )
          );

          resolve();
        } catch (err) {
          console.error("Initialization failed:", err);
          reject(err); // Reject if retries fail after all attempts
        }
      });
    });
  }
}

const retryOperation = async (operation: any, maxRetries: any, delay = 500) => {
  let attempt = 0;

  while (attempt < maxRetries) {
    try {
      return await operation();
    } catch (err) {
      attempt++;
      if (attempt >= maxRetries) {
        throw err; // Rethrow if max retries exceeded
      }
      console.warn(
        `Retrying operation (attempt ${attempt}) due to error:`,
        err
      );
      await new Promise((res) => setTimeout(res, delay * Math.pow(2, attempt))); // Exponential backoff
    }
  }
};
