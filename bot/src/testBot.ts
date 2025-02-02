import dotenv from "dotenv";
dotenv.config();

import "./errors";
import "./server";
import { qrCache } from "./server";

import { getWhatsappClient } from "./whatsappclient";
import { TextCommanderBus } from "./commander";
import { FriendsKeeperPlugin } from "./plugins/friendskeeper";
import { ShortcutsPlugin } from "./plugins/shortcuts";
import { initBot } from "./apis/bot";

const userId = "user_2roH7uYsYk5m4ORVmNkCw7KLqrh";
initBot(userId);

