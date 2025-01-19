import dotenv from "dotenv";
dotenv.config();

import { TextCommanderBus } from "./commander";
import { FriendsKeeperPlugin } from "./plugins/friendskeeper";
import { ShortcutsPlugin } from "./plugins/shortcuts";
import { getWhatsappClient } from "./whatsappclient";

import "./errors";
import "./server";

async function main(userId: string) {
  try {
    const client = await getWhatsappClient(userId);
    const bus = new TextCommanderBus(client);
    bus.add_plugin(new FriendsKeeperPlugin());
    bus.add_plugin(new ShortcutsPlugin());
    await bus.start();
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

// main()

export { main };
