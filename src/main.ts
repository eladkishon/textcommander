import { ChatCommanderBus } from "./commander"
import { EmergencyPlugin } from "./emergency_plugin"
import { getWhatsappClient } from "./whatsappclient"

const client = getWhatsappClient()
const bus = new ChatCommanderBus(client)
bus.add_plugin(new EmergencyPlugin())

bus.start().then(console.log).catch(console.error)