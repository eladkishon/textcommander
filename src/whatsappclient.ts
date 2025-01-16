import { Client, LocalAuth, RemoteAuth } from "whatsapp-web.js";
import { MongoStore } from 'wwebjs-mongo';
import mongoose from 'mongoose';
import { DATA_FOLDER } from "./fs";

export const getWhatsappClient = async () => {
    let client: Client;

    console.log("Getting WhatsApp client", process.env.WHATSAPP_AUTH || 'local')

    if (process.env.WHATSAPP_AUTH === 'remote') {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("Connected to MongoDB")
        const store = new MongoStore({ mongoose: mongoose });
        client = new Client({
            authStrategy: new RemoteAuth({
                clientId: process.env.USER_ID,
                store: store,
                backupSyncIntervalMs: 300000,
                dataPath: `${DATA_FOLDER}/whatsapp/${process.env.USER_ID}`,
            }),
            takeoverOnConflict: true,
            puppeteer: {
                headless: true,
                args: ['--no-sandbox', '--disable-setuid-sandbox'],
            }
        });

        client.on('remote_session_saved', () => {
            console.log("Remote session saved")
        })
        client.on('authenticated', () => {
            console.log('WhatsApp client is authenticated.');
        });
        client.on('auth_failure', msg => {
            console.error('WhatsApp client authentication failure', msg);
        });
    } else {
        client = new Client({
            authStrategy: new LocalAuth(),
            puppeteer: {
                args: ['--no-sandbox', '--disable-setuid-sandbox'],
            }
        });
    }


    return client
}

