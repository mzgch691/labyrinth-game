import type { ClientMessage } from "../../shared/types.js";
import { onReady, onUnready } from "../handlers/ready.js";
import { onMove } from "../handlers/move.js";
import { leaveRoom } from "../handlers/room.js";
import { createPlayer, removePlayer, type Player } from "../state/players.js";
import { getRoomState, removeRoomState } from "../state/rooms.js";
import { WebSocket } from "ws";

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
    if (player.roomId !== null) {
      const room = getRoomState(player.roomId);
      if (room) {
        const opponent = room.players.find((p) => p.id !== player.id) || null;
        if (opponent && opponent.socket.readyState === WebSocket.OPEN && player.maze) {
          opponent.socket.send(
            JSON.stringify({
              type: "GAME_OVER",
              winnerId: opponent.id,
              opponentMaze: player.maze,
              reason: "disconnect",
            })
          );
        }
        if (opponent) {
          opponent.roomId = null;
          opponent.ready = false;
        }
        removeRoomState(room.id);
      }
    }
    removePlayer(player);
  });
}
