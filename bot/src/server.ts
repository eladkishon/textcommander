import express from "express";
import cors from "cors";
import { initBot } from "./apis/bot";

import NodeCache from "node-cache";
import { createClient } from "@supabase/supabase-js";

export const qrCache = new NodeCache({ stdTTL: 200 });

const app = express();
const port = process.env.PORT || 3001;
app.use(express.json());
app.use(cors());

app.get("/health", (req, res) => {
  res.send("OK");
});

async function getOrCreateQrCode(userId: string) {
  const existingQrCode = qrCache.get(userId);
  if (existingQrCode) {
    return { success: true, qrCode: existingQrCode };
  }

  try {
    console.log("QR code not found, starting new bot...", userId);
    await initBot(userId);
    const newQrCode = qrCache.get(userId);

    if (!newQrCode) {
      return { 
        success: false, 
        error: "Failed to generate QR code" 
      };
    }

    return { success: true, qrCode: newQrCode };
  } catch (error) {
    console.error("Error starting bot:", error);
    return { 
      success: false, 
      error: "Error starting bot" 
    };
  }
}

app.get("/bots/:userId/qrcode", async (req, res) => {
  const { userId } = req.params;
  const result = await getOrCreateQrCode(userId);

  if (result.success) {
    res.status(200).json({ qrCode: result.qrCode });
  } else {
    res.status(500).json({ message: result.error });
  }
});

app.listen(Number(port), "0.0.0.0", () => {
  console.log(`Server is running at http://0.0.0.0:${port}`);
});
