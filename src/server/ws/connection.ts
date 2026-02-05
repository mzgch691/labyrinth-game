import type { ClientMessage } from "../../shared/types.js";
import { onReady, onUnready } from "../handlers/ready.js";
import { onMove } from "../handlers/move.js";
import { leaveRoom } from "../handlers/room.js";
import { createPlayer, removePlayer, type Player } from "../state/players.js";
import type { WebSocket } from "ws";

function onSubmitMaze(player: Player, msg: ClientMessage & { type: "SUBMIT_MAZE" }) {
  player.maze = msg.maze;
  console.log(`[MAZE] player=${player.id} submitted maze: ${msg.maze.name}`);
}

export function handleConnection(socket: WebSocket) {
  const player = createPlayer(socket);
  console.log(`[CONNECT] player=${player.id}`);

  socket.on("message", (data) => {
    const msg: ClientMessage = JSON.parse(data.toString());

    switch (msg.type) {
      case "SUBMIT_MAZE":
        onSubmitMaze(player, msg);
        break;
      case "READY":
        onReady(player);
        break;
      case "UNREADY":
        onUnready(player);
        break;
      case "MOVE":
        onMove(player, msg.direction);
        break;
      case "LEAVE_MATCH":
        leaveRoom(player, msg.roomId);
        break;
      default:
        console.warn("[UNKNOWN]", msg);
    }
  });

  socket.on("close", () => {
    console.log(`[DISCONNECT] player=${player.id}`);
    removePlayer(player);
  });
}
