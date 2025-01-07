import { TextCommanderBus } from "./commander"
import { ChatCleanerPlugin } from "./plugins/chat_cleaner"
import { EmergencyPlugin } from "./plugins/emergency"
import { FriendsKeeperPlugin } from "./plugins/friendskeeper"
import { ShortcutsPlugin } from "./plugins/shortcuts"
import { getWhatsappClient } from "./thirdparty/whatsappclient"

const client = getWhatsappClient()
const bus = new TextCommanderBus(client)
bus.add_plugin(new EmergencyPlugin())
// bus.add_plugin(new ChatCleanerPlugin())
bus.add_plugin(new FriendsKeeperPlugin())
bus.add_plugin(new ShortcutsPlugin())

bus.start().then().catch(console.error)


// create a new server with health check
import express from 'express'

const app = express()
const port =(process.env.PORT) || 3000

app.get('/health', (req, res) => {
    res.send('OK')
})

app.listen(Number(port), '0.0.0.0', () => {
    console.log(`Server is running at http://localhost:${port}`)
})