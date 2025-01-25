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

app.get("/bots/:userId/qrcode", (req, res) => {
  const { userId } = req.params;
  // console.log("Getting QR code...", userId);
  const qrCode = qrCache.get(userId);
  // console.log("QR code", qrCode);
  if (qrCode) {
    res.json({ qrCode });
  } else {
    res.status(400).json({ message: "QR code not found." });
  }
});

app.post("/bots/:userId", (req, res) => {
  const { userId } = req.params;
  console.log("Starting bot...", userId);
  if (userId) {
    initBot(userId)
      .then(() => {
        console.log("Bot started");
      })
      .catch((e) => {
        console.error(e);
      });
    res.json({ message: "bot is started" }); // Send the QR code data to the frontend
  } else {
    res.status(400).json({ message: "bot has not started." }); // Error message if QR code not available
  }
});

app.listen(Number(port), "0.0.0.0", () => {
  console.log(`Server is running at http://0.0.0.0:${port}`);
});
