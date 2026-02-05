import type { Direction } from "../../shared/types.js";
import type { Player } from "../state/players.js";
import { getRoomState } from "../state/rooms.js";
import { getDelta, hasWall } from "../utils/maze.js";

export function onMove(player: Player, direction: Direction) {
  if (player.roomId === null) return;
  const room = getRoomState(player.roomId);
  if (!room) return;

  if (room.attackerId !== player.id) {
    return; // Not this player's turn
  }

  const opponent = room.players.find((p) => p.id !== player.id);
  if (!opponent || !opponent.maze) return;

  const currentPos = room.positions[player.id];
  const { dx, dy } = getDelta(direction);
  const nextPos = { x: currentPos.x + dx, y: currentPos.y + dy };

  const blocked = hasWall(opponent.maze, currentPos.x, currentPos.y, direction);
  const success = !blocked;

  room.movedThisTurn.add(player.id);

  if (success) {
    room.positions[player.id] = nextPos;
  }

  // Change attacker regardless of success or failure
  room.attackerId = opponent.id;

  if (room.movedThisTurn.has(room.attackerId)) {
    room.turnNumber += 1;
    room.movedThisTurn = new Set<number>([room.attackerId]);
  }

  const payload = {
    type: "MOVE_RESULT",
    success,
    playerId: player.id,
    from: currentPos,
    to: success ? nextPos : currentPos,
    direction,
    attackerId: room.attackerId,
    turnNumber: room.turnNumber,
  };

  room.players.forEach((p) => {
    p.socket.send(JSON.stringify(payload));
  });

  // Check goal reached (after MOVE_RESULT sent)
  if (success && nextPos.x === opponent.maze.goal.x && nextPos.y === opponent.maze.goal.y) {
    // Victory!
    const gameOverPayload = {
      type: "GAME_OVER",
      winnerId: player.id,
      opponentMaze: opponent.maze,
    };
    room.players.forEach((p) => {
      p.socket.send(JSON.stringify(gameOverPayload));
    });
  }
}
