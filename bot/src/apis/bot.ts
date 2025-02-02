import { TextCommanderBus } from "../commander";
import { FriendsKeeperPlugin } from "../plugins/friendskeeper";
import { ShortcutsPlugin } from "../plugins/shortcuts";
import { qrCache } from "../server";
import { getWhatsappClient } from "../whatsappclient";
import * as qrcode from "qrcode-terminal";

async function initBot(userId: string) {
  try {
    const client = await getWhatsappClient(userId);
    client.on("qr", (qr) => {
      console.log("QR RECEIVED", qr);
      qrcode.generate(qr, { small: true });
      qrCache.set(userId, qr);
    });

    const bus = new TextCommanderBus(client, userId);
    bus.add_plugin(new FriendsKeeperPlugin(userId));
    bus.add_plugin(new ShortcutsPlugin());
    await bus.start();
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}
export { initBot };
