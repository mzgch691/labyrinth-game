import type { Maze } from "../../shared/types.js";

// save maze to local storage
export function saveMazeToLocalStorage(maze: Maze): void {
  const mazes = loadMazesFromLocalStorage();
  mazes.push(maze);
  localStorage.setItem("labyrinths", JSON.stringify(mazes));
}

// load mazes from local storage
export function loadMazesFromLocalStorage(): Maze[] {
  const data = localStorage.getItem("labyrinths");
  return data ? JSON.parse(data) : [];
}

// update maze in local storage
export function updateMazeInLocalStorage(mazeId: string, maze: Maze): boolean {
  const mazes = loadMazesFromLocalStorage();
  const idx = mazes.findIndex((m) => m.id === mazeId);
  if (idx !== -1) {
    mazes[idx] = maze;
    localStorage.setItem("labyrinths", JSON.stringify(mazes));
    return true;
  }
  return false;
}
