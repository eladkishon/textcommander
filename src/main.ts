import dotenv from "dotenv";
dotenv.config();
import NodeCache from "node-cache";
import { createClient } from "@supabase/supabase-js";

export const qrCache = new NodeCache({ stdTTL: 200 });

export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

import "./errors";
import "./server";
