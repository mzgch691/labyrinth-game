// -----------------------------
// Screen state
// -----------------------------
export type Screen = "title" | "lobby" | "match" | "mazeSelect" | "mazeMake";

// -----------------------------
// Maze cell and direction
// -----------------------------
export type Direction = "up" | "down" | "left" | "right";

export type Cell = {
  x: number;
  y: number;
  walls: {
    up: boolean;
    down: boolean;
    left: boolean;
    right: boolean;
  };
};

// -----------------------------
// Entire maze
// -----------------------------
export type Maze = {
  id: string;
  name: string;
  width: number;
  height: number;
  cells: Cell[];
  start: { x: number; y: number };
  goal: { x: number; y: number };
  wallCount: number;
  createdAt: number;
  updatedAt: number;
};

// -----------------------------
// Player state
// -----------------------------
export type PlayerState = {
  id: number;
  x: number;
  y: number;
  roomId: number | null;
  name?: string;
};

// -----------------------------
// Room info
// -----------------------------
export type Room = {
  id: number;
  maze: Maze;
  players: PlayerState[];
};

// -----------------------------
// Client -> Server message
// -----------------------------
export type ClientMessage =
  | { type: "READY" }
  | { type: "UNREADY" }
  | { type: "SUBMIT_MAZE"; maze: Maze }
  | { type: "MOVE"; direction: Direction }
  | { type: "LEAVE_MATCH"; roomId: number };

// -----------------------------
// Server -> Client message
// -----------------------------
export type ServerMessage =
  | { type: "START_MATCH"; roomId: number; playerId: number }
  | {
      type: "MAZE_DATA";
      myMaze: Maze;
      opponentMaze: Maze;
      myPosition: { x: number; y: number };
      opponentPosition: { x: number; y: number };
      attackerId: number;
      turnNumber: number;
    }
  | { type: "ROOM_UPDATE"; players: PlayerState[] }
  | {
      type: "MOVE_RESULT";
      success: boolean;
      playerId: number;
      from: { x: number; y: number };
      to: { x: number; y: number };
      direction: Direction;
      attackerId: number;
      turnNumber: number;
    }
  | {
      type: "GAME_OVER";
      winnerId: number;
      opponentMaze: Maze;
      reason?: "goal" | "disconnect";
    };
