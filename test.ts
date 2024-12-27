import { EmergencyPlugin } from "./src/emergency_plugin";
import { ChatCommanderBus } from "./src/commander";
import { getWhatsappClient } from "./src/whatsappclient";


(
    async function () {
        const client = getWhatsappClient()
        const bus = new ChatCommanderBus(client)
        bus.add_plugin(new EmergencyPlugin())

        await bus.start()

        client.emit('call', { from: '972528331981@c.us', })
        client.emit('call', { from: '972528331981@c.us', })
        client.emit('call', { from: '972528331981@c.us', })
        client.emit('call', { from: '972528331981@c.us', })
        client.emit('message', { from: '972528331981@c.us', body: 'מה יש לך ?' })

    }
)()


