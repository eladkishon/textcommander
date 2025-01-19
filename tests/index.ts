// import { TextCommanderBus } from "../src/commander";
// import { EmergencyPlugin } from "../src/plugins/emergency";
// import { getWhatsappClient } from "../src/whatsappclient";

// (async function () {
//   const client = await getWhatsappClient();
//   const bus = new TextCommanderBus(client);
//   bus.add_plugin(new EmergencyPlugin());

//   await bus.start();

//   client.emit("call", { from: "972528331981@c.us" });
//   client.emit("call", { from: "972528331981@c.us" });
//   client.emit("call", { from: "972528331981@c.us" });
//   client.emit("call", { from: "972528331981@c.us" });
//   client.emit("message", { from: "972528331981@c.us", body: "מה יש לך ?" });
// })();
