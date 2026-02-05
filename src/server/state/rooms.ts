import type { Player } from "./players.js";

export type RoomState = {
  id: number;
  players: [Player, Player];
  positions: Record<number, { x: number; y: number }>;
  attackerId: number;
  turnNumber: number;
  movedThisTurn: Set<number>;
};

const rooms = new Map<number, RoomState>();

export function createRoomState(roomId: number, players: [Player, Player]) {
  const [p1, p2] = players;
  const positions: Record<number, { x: number; y: number }> = {};

  // Each player starts from opponent's maze start position
  positions[p1.id] = { x: p2.maze!.start.x, y: p2.maze!.start.y };
  positions[p2.id] = { x: p1.maze!.start.x, y: p1.maze!.start.y };

  const room: RoomState = {
    id: roomId,
    players,
    positions,
    attackerId: p1.id,
    turnNumber: 1,
    movedThisTurn: new Set<number>(),
  };

  rooms.set(roomId, room);
  return room;
}

export function getRoomState(roomId: number) {
  return rooms.get(roomId) || null;
}

export function removeRoomState(roomId: number) {
  rooms.delete(roomId);
}
