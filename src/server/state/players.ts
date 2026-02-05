import type { WebSocket } from "ws";
import type { Maze } from "../../shared/types.js";

export type Player = {
  id: number;
  socket: WebSocket;
  ready: boolean;
  roomId: number | null;
  maze: Maze | null;
};

export const players: Player[] = [];

let nextPlayerId = 1;

export function createPlayer(socket: WebSocket): Player {
  const player: Player = {
    id: nextPlayerId++,
    socket,
    ready: false,
    roomId: null,
    maze: null,
  };
  players.push(player);
  return player;
}

export function removePlayer(player: Player) {
  const idx = players.indexOf(player);
  if (idx !== -1) players.splice(idx, 1);
}

