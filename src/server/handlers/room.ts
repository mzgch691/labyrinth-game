import { players, Player } from "../state/players.js";
import { createRoomState, getRoomState, removeRoomState } from "../state/rooms.js";

let nextRoomId = 1;

export function tryCreateRoom() {
  const readyPlayers = players.filter(
    (p) => p.ready && p.roomId === null && p.maze !== null
  );

  if (readyPlayers.length < 2) return;

  const roomId = nextRoomId++;
  const selected = readyPlayers.slice(0, 2) as [Player, Player];

  console.log(
    `[ROOM_CREATE] roomId=${roomId}, players=${selected.map(p => p.id).join(",")}`
  );

  const room = createRoomState(roomId, selected);

  selected.forEach((p, index) => {
    p.roomId = roomId;
    p.ready = false;

    // Notify match start
    p.socket.send(
      JSON.stringify({
        type: "START_MATCH",
        roomId,
        playerId: p.id,
      })
    );

    // Send maze data (own maze and opponent's maze)
    const opponent = selected[1 - index];
    if (p.maze && opponent.maze) {
      p.socket.send(
        JSON.stringify({
          type: "MAZE_DATA",
          myMaze: p.maze,
          opponentMaze: opponent.maze,
          myPosition: room.positions[p.id],
          opponentPosition: room.positions[opponent.id],
          attackerId: room.attackerId,
          turnNumber: room.turnNumber,
        })
      );
    }
  });
}

export function leaveRoom(player: Player, roomId: number) {
  if (player.roomId !== roomId) {
    console.warn(
      `[IGNORED] LEAVE_MATCH mismatch player=${player.id}`
    );
    return;
  }

  console.log(
    `[ROOM_LEAVE] player=${player.id}, roomId=${roomId}`
  );

  player.roomId = null;
  player.ready = false;

  const room = getRoomState(roomId);
  if (room) {
    removeRoomState(roomId);
  }
}
