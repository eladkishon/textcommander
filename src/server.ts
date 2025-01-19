import express from "express";
import { main } from "./main";
import cors from "cors";

const app = express();
const port = process.env.PORT || 3001;
app.use(express.json());
app.use(cors());

app.get("/health", (req, res) => {
  res.send("OK");
});

app.get("/qr-code", (req, res) => {
  console.log("process.env.QR_CODE", process.env.QR_CODE);
  if (process.env.QR_CODE) {
    res.json({ qrCode: process.env.QR_CODE }); // Send the QR code data to the frontend
  } else {
    res.status(400).json({ message: "QR code not generated yet." }); // Error message if QR code not available
  }
});

app.post("/start-bot", (req, res) => {
  const { userId } = req.body;
  console.log("Starting bot...", userId);
  if (userId) {
    main(userId);
    res.json({ message: "bot is started" }); // Send the QR code data to the frontend
  } else {
    res.status(400).json({ message: "bot has not started." }); // Error message if QR code not available
  }
});

app.listen(Number(port), "0.0.0.0", () => {
  console.log(`Server is running at http://0.0.0.0:${port}`);
});
