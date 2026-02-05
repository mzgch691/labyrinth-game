import { WebSocketServer } from "ws";
import { handleConnection } from "./ws/connection.js";

const wss = new WebSocketServer({ port: 8080 });
console.log("WS server listening on ws://localhost:8080");

wss.on("connection", handleConnection);
