import makeWASocket, { useMultiFileAuthState } from "@whiskeysockets/baileys";
import pino from "pino";

async function connectWhatsapp() {
  const auth = await useMultiFileAuthState("session"); // Entender demais opções
  const socket = makeWASocket({
    printQRInTerminal: true,
    browser: ["BOT", "", ""],
    auth: auth.state,
    logger: pino({ level: "silent" }),
    version: [2, 3000, 1013812660],
  });

  socket.ev.on("creds.update", auth.saveCreds);
  socket.ev.on("connection.update", async ({ connection }) => {
    if (connection === "open") {
      console.log("ready to use");
    } else if (connection === "close") {
      console.log("close connection");
      await connectWhatsapp();
    }
    // ...Add demais possibilidades
  });

  socket.ev.on("messages.upsert", async ({ messages, type }) => {
    console.log(messages);
  });
}

connectWhatsapp();
