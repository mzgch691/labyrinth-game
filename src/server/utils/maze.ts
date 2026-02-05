import type { Direction } from "../../shared/types.js";

// Get movement delta for specified direction
export function getDelta(direction: Direction): { dx: number; dy: number } {
  switch (direction) {
    case "up":
      return { dx: 0, dy: -1 };
    case "down":
      return { dx: 0, dy: 1 };
    case "left":
      return { dx: -1, dy: 0 };
    case "right":
      return { dx: 1, dy: 0 };
  }
}

// Check if wall exists at specified position in specified direction
export function hasWall(
  maze: { width: number; height: number; cells: any[] },
  x: number,
  y: number,
  direction: Direction
): boolean {
  if (direction === "left") {
    if (x <= 0) return true;
    const cell = maze.cells.find((c) => c.x === x - 1 && c.y === y);
    return cell ? cell.walls.right : true;
  }
  if (direction === "right") {
    if (x >= maze.width - 1) return true;
    const cell = maze.cells.find((c) => c.x === x && c.y === y);
    return cell ? cell.walls.right : true;
  }
  if (direction === "up") {
    if (y <= 0) return true;
    const cell = maze.cells.find((c) => c.x === x && c.y === y - 1);
    return cell ? cell.walls.down : true;
  }
  if (direction === "down") {
    if (y >= maze.height - 1) return true;
    const cell = maze.cells.find((c) => c.x === x && c.y === y);
    return cell ? cell.walls.down : true;
  }
  return true;
}
