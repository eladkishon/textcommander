import { ChatCommanderBus } from "./commander"
import { ChatCleanerPlugin } from "./plugins/chat_cleaner"
import { EmergencyPlugin } from "./plugins/emergency"
import { getWhatsappClient } from "./whatsappclient"

const client = getWhatsappClient()
const bus = new ChatCommanderBus(client)
bus.add_plugin(new EmergencyPlugin())
bus.add_plugin(new ChatCleanerPlugin())

bus.start().then().catch(console.error)