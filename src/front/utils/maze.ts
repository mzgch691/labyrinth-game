import type { Cell } from "../../shared/types.js";

const MAZE_SIZE = 6;

// Check if goal is reachable from start using BFS
export function isGoalReachable(
  cells: Cell[],
  start: { x: number; y: number },
  goal: { x: number; y: number }
): boolean {
  const visited = new Set<string>();
  const queue: Array<{ x: number; y: number }> = [start];
  visited.add(`${start.x},${start.y}`);

  while (queue.length > 0) {
    const current = queue.shift();
    if (!current) break;

    // Goal reached
    if (current.x === goal.x && current.y === goal.y) {
      return true;
    }

    const cell = cells.find((c) => c.x === current.x && c.y === current.y);
    if (!cell) continue;

    // Check up
    if (!cell.walls.up && current.y > 0) {
      const key = `${current.x},${current.y - 1}`;
      if (!visited.has(key)) {
        visited.add(key);
        queue.push({ x: current.x, y: current.y - 1 });
      }
    }

    // Check down
    if (!cell.walls.down && current.y < MAZE_SIZE - 1) {
      const key = `${current.x},${current.y + 1}`;
      if (!visited.has(key)) {
        visited.add(key);
        queue.push({ x: current.x, y: current.y + 1 });
      }
    }

    // Check left
    if (!cell.walls.left && current.x > 0) {
      const key = `${current.x - 1},${current.y}`;
      if (!visited.has(key)) {
        visited.add(key);
        queue.push({ x: current.x - 1, y: current.y });
      }
    }

    // Check right
    if (!cell.walls.right && current.x < MAZE_SIZE - 1) {
      const key = `${current.x + 1},${current.y}`;
      if (!visited.has(key)) {
        visited.add(key);
        queue.push({ x: current.x + 1, y: current.y });
      }
    }
  }

  return false;
}
