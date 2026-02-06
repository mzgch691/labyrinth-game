import type { Maze } from "../../shared/types.js";

const CELL_SIZE = 50;
const WALL_SIZE = 8;

export interface RenderMazeDisplayOptions {
  wallMarks?: Record<string, "open" | "blocked">;
  blockedColor?: string;
  defaultColor?: string;
  position?: { x: number; y: number } | null;
  positionColor?: string;
  isOwnMaze?: boolean;
  showAnswer?: boolean;
  answerMaze?: Maze | null;
  movableCells?: Array<{x: number, y: number}>;
  onCellClick?: (x: number, y: number) => void;
}

// Render maze with optional wall marks and position markers
export function renderMazeDisplay(
  container: HTMLElement,
  maze: Maze,
  options: RenderMazeDisplayOptions = {}
): void {
  const {
    wallMarks = {},
    blockedColor = "#000",
    defaultColor = "#ddd",
    position = null,
    positionColor = "#00f",
    isOwnMaze = false,
    showAnswer = false,
    answerMaze = null,
    movableCells = [],
    onCellClick,
  } = options;

  const MAZE_SIZE = maze.width;

  const gridContainer = document.createElement("div");
  gridContainer.style.display = "inline-block";
  gridContainer.style.border = "2px solid #000";
  gridContainer.style.backgroundColor = "#f5f5f5";

  const gridRows = MAZE_SIZE * 2 - 1;

  for (let gridY = 0; gridY < gridRows; gridY++) {
    const row = document.createElement("div");
    row.style.display = "flex";
    row.style.height = gridY % 2 === 0 ? `${CELL_SIZE}px` : `${WALL_SIZE}px`;

    const gridCols = MAZE_SIZE * 2 - 1;

    for (let gridX = 0; gridX < gridCols; gridX++) {
      const element = document.createElement("div");
      element.style.width = gridX % 2 === 0 ? `${CELL_SIZE}px` : `${WALL_SIZE}px`;
      element.style.height = "100%";
      element.style.position = "relative";
      element.style.display = "flex";
      element.style.alignItems = "center";
      element.style.justifyContent = "center";

      if (gridY % 2 === 0 && gridX % 2 === 0) {
        // Cell
        const cellX = Math.floor(gridX / 2);
        const cellY = Math.floor(gridY / 2);
        
        // Check if this cell is movable
        const isMovable = movableCells.some(cell => cell.x === cellX && cell.y === cellY);
        
        if (isMovable) {
          element.style.backgroundColor = "#ffcccc"; // Light red for movable cells
          element.style.cursor = "pointer";
          element.onclick = () => {
            if (onCellClick) {
              onCellClick(cellX, cellY);
            }
          };
        } else {
          element.style.backgroundColor = "#fff";
        }

        // Coordinate label
        const coordLabel = document.createElement("div");
        coordLabel.style.fontSize = "10px";
        coordLabel.style.color = "#999";
        coordLabel.style.position = "absolute";
        coordLabel.style.top = "2px";
        coordLabel.style.left = "2px";
        coordLabel.textContent = `${String.fromCharCode(65 + cellX)}${cellY + 1}`;
        element.appendChild(coordLabel);

        // Start/Goal marker
        if (maze.start.x === cellX && maze.start.y === cellY) {
          const marker = document.createElement("div");
          marker.textContent = "S";
          marker.style.fontSize = "16px";
          marker.style.fontWeight = "bold";
          marker.style.color = "blue";
          marker.style.position = "absolute";
          element.appendChild(marker);
        } else if (maze.goal.x === cellX && maze.goal.y === cellY) {
          const marker = document.createElement("div");
          marker.textContent = "G";
          marker.style.fontSize = "16px";
          marker.style.fontWeight = "bold";
          marker.style.color = "red";
          marker.style.position = "absolute";
          element.appendChild(marker);
        }

        // Player position
        if (position && position.x === cellX && position.y === cellY) {
          const pos = document.createElement("div");
          pos.textContent = "〇";
          pos.style.fontSize = "36px";
          pos.style.fontWeight = "bold";
          pos.style.color = positionColor;
          pos.style.position = "absolute";
          element.appendChild(pos);
        }
      } else if (gridY % 2 === 0 && gridX % 2 === 1) {
        // Vertical wall
        const cellX = Math.floor(gridX / 2);
        const cellY = Math.floor(gridY / 2);
        const key = `${cellX},${cellY},right`;
        const mark = wallMarks[key];

        if (isOwnMaze) {
          // Own maze: display actual wall information
          const cell = maze.cells.find((c) => c.x === cellX && c.y === cellY);
          const hasWall = cell?.walls.right ?? false;

          if (mark === "open") {
            element.style.backgroundColor = "#fff";
          } else if (mark === "blocked") {
            element.style.backgroundColor = blockedColor;
          } else {
            element.style.backgroundColor = hasWall ? "#000" : "#ddd";
          }
        } else if (showAnswer && answerMaze) {
          // After game end: merge discovered info with answer
          if (mark === "open") {
            element.style.backgroundColor = "#fff";
          } else if (mark === "blocked") {
            element.style.backgroundColor = blockedColor;
          } else {
            // Unknown: use answer
            const cell = answerMaze.cells.find((c) => c.x === cellX && c.y === cellY);
            const hasWall = cell?.walls.right ?? false;
            element.style.backgroundColor = hasWall ? "#000" : "#ddd";
          }
        } else {
          // Inferring maze: marks only
          if (mark === "open") {
            element.style.backgroundColor = "#fff";
          } else if (mark === "blocked") {
            element.style.backgroundColor = blockedColor;
          } else {
            element.style.backgroundColor = defaultColor;
          }
        }
      } else if (gridY % 2 === 1 && gridX % 2 === 0) {
        // Horizontal wall
        const cellX = Math.floor(gridX / 2);
        const cellY = Math.floor(gridY / 2);
        const key = `${cellX},${cellY},down`;
        const mark = wallMarks[key];

        if (isOwnMaze) {
          // Own maze: display actual wall information
          const cell = maze.cells.find((c) => c.x === cellX && c.y === cellY);
          const hasWall = cell?.walls.down ?? false;

          if (mark === "open") {
            element.style.backgroundColor = "#fff";
          } else if (mark === "blocked") {
            element.style.backgroundColor = blockedColor;
          } else {
            element.style.backgroundColor = hasWall ? "#000" : "#ddd";
          }
        } else if (showAnswer && answerMaze) {
          // After game end: merge discovered info with answer
          if (mark === "open") {
            element.style.backgroundColor = "#fff";
          } else if (mark === "blocked") {
            element.style.backgroundColor = blockedColor;
          } else {
            // Unknown: use answer
            const cell = answerMaze.cells.find((c) => c.x === cellX && c.y === cellY);
            const hasWall = cell?.walls.down ?? false;
            element.style.backgroundColor = hasWall ? "#000" : "#ddd";
          }
        } else {
          // Inferring maze: marks only
          if (mark === "open") {
            element.style.backgroundColor = "#fff";
          } else if (mark === "blocked") {
            element.style.backgroundColor = blockedColor;
          } else {
            element.style.backgroundColor = defaultColor;
          }
        }
      } else {
        // Intersection
        element.style.backgroundColor = "#999";
      }

      row.appendChild(element);
    }

    gridContainer.appendChild(row);
  }

  container.appendChild(gridContainer);
}
