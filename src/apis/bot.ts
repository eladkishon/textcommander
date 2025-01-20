import { TextCommanderBus } from "../commander";
import { qrCache } from "../main";
import { FriendsKeeperPlugin } from "../plugins/friendskeeper";
import { ShortcutsPlugin } from "../plugins/shortcuts";
import { getWhatsappClient } from "../whatsappclient";

//TODO add cache as parameter
async function initBot(userId: string) {
  try {
    const client = await getWhatsappClient(userId);
    client.on("qr", (qr) => {
      qrCache.set(userId, qr);
      console.log("cache", qrCache);
    });
    const bus = new TextCommanderBus(client,userId);
    bus.add_plugin(new FriendsKeeperPlugin());
    bus.add_plugin(new ShortcutsPlugin());
    await bus.start();
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

export { initBot };
