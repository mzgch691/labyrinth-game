import type { Maze } from "../../shared/types.js";

// Match state
export let myMaze: Maze | null = null;
export let opponentMaze: Maze | null = null;
export let myPlayerId: number | null = null;
export let attackerId: number | null = null;
export let turnNumber: number = 1;
export let myPosition: { x: number; y: number } | null = null;
export let opponentPosition: { x: number; y: number } | null = null;
export let inferenceWallMarks: Record<string, "open" | "blocked"> = {};
export let myMazeWallMarks: Record<string, "open" | "blocked"> = {};
export let gameOver: boolean = false;
export let winnerId: number | null = null;
export let gameOverReason: "goal" | "disconnect" | null = null;
export let answerMaze: Maze | null = null;

export function getMyMaze(): Maze | null {
  return myMaze;
}

export function setMyMaze(maze: Maze | null): void {
  myMaze = maze;
}

export function getOpponentMaze(): Maze | null {
  return opponentMaze;
}

export function setOpponentMaze(maze: Maze | null): void {
  opponentMaze = maze;
}

export function getMyPlayerId(): number | null {
  return myPlayerId;
}

export function setMyPlayerId(id: number | null): void {
  myPlayerId = id;
}

export function getAttackerId(): number | null {
  return attackerId;
}

export function setAttackerId(id: number | null): void {
  attackerId = id;
}

export function getTurnNumber(): number {
  return turnNumber;
}

export function setTurnNumber(num: number): void {
  turnNumber = num;
}

export function getMyPosition(): { x: number; y: number } | null {
  return myPosition;
}

export function setMyPosition(pos: { x: number; y: number } | null): void {
  myPosition = pos;
}

export function getOpponentPosition(): { x: number; y: number } | null {
  return opponentPosition;
}

export function setOpponentPosition(pos: { x: number; y: number } | null): void {
  opponentPosition = pos;
}

export function getInferenceWallMarks(): Record<string, "open" | "blocked"> {
  return inferenceWallMarks;
}

export function setInferenceWallMark(key: string, value: "open" | "blocked"): void {
  inferenceWallMarks[key] = value;
}

export function getMyMazeWallMarks(): Record<string, "open" | "blocked"> {
  return myMazeWallMarks;
}

export function setMyMazeWallMark(key: string, value: "open" | "blocked"): void {
  myMazeWallMarks[key] = value;
}

export function resetWallMarks(): void {
  inferenceWallMarks = {};
  myMazeWallMarks = {};
}

export function getGameOver(): boolean {
  return gameOver;
}

export function setGameOver(value: boolean): void {
  gameOver = value;
}

export function getWinnerId(): number | null {
  return winnerId;
}

export function setWinnerId(id: number | null): void {
  winnerId = id;
}

export function getGameOverReason(): "goal" | "disconnect" | null {
  return gameOverReason;
}

export function setGameOverReason(reason: "goal" | "disconnect" | null): void {
  gameOverReason = reason;
}

export function getAnswerMaze(): Maze | null {
  return answerMaze;
}

export function setAnswerMaze(maze: Maze | null): void {
  answerMaze = maze;
}

export function getWallKey(x: number, y: number, direction: "up" | "down" | "left" | "right"): string {
  if (direction === "right") {
    return `${x},${y},right`;
  }
  if (direction === "left") {
    return `${x - 1},${y},right`;
  }
  if (direction === "down") {
    return `${x},${y},down`;
  }
  return `${x},${y - 1},down`;
}

export function resetMatchState(): void {
  myMaze = null;
  opponentMaze = null;
  myPlayerId = null;
  attackerId = null;
  turnNumber = 1;
  myPosition = null;
  opponentPosition = null;
  inferenceWallMarks = {};
  myMazeWallMarks = {};
  gameOver = false;
  winnerId = null;
  gameOverReason = null;
  answerMaze = null;
}
