import { Call, Chat, Client, Message } from "whatsapp-web.js";

export interface CommanderPlugin {
  init(userId: string, client: Client, botChat: Chat): Promise<void>;
  onMessage(msg: Message): Promise<void>;
  onCall(call: Call): Promise<void>;
  onCommand(command: string): Promise<void>;
}

export type UserContact = {
  id: number;
  user_id: string;
  contact_id: string;
  contact_name: string;
  created_at: Date | null;
  is_tracked: boolean;
};
