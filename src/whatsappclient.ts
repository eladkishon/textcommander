import { Client, LocalAuth } from "whatsapp-web.js";

const client = new Client({
    authStrategy: new LocalAuth(),
});


export const getWhatsappClient = () => {
    return client
}