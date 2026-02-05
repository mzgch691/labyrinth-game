import { WebSocketServer } from "ws";
import { handleConnection } from "./ws/connection.js";

const port = Number(process.env.PORT) || 8080;
const wss = new WebSocketServer({ port });
console.log(`WS server listening on ws://localhost:${port}`);

wss.on("connection", handleConnection);
