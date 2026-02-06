import { navigate } from "../router.js";
import { getSelectedMazeId, setSelectedMazeId } from "../state.js";
import type { Maze, Cell } from "../../shared/types.js";
import { isGoalReachable } from "../utils/maze.js";
import { saveMazeToLocalStorage, loadMazesFromLocalStorage, updateMazeInLocalStorage } from "../utils/storage.js";
import { showConfirmDialog, showAlertDialog, showSimpleConfirmDialog } from "../components/confirmDialog.js";

const MAZE_SIZE = 6;
const MAX_WALLS = 20;
const CELL_SIZE = 100;
const WALL_SIZE = 16;

export function renderMazeMake(root: HTMLElement) {
  // clean
  root.innerHTML = "";

  // setting title
  const titleText = document.createElement("h1");
  const mazeId = getSelectedMazeId();
  titleText.textContent = "迷路作成画面";
  root.appendChild(titleText);

  // road maze data
  let mazes = loadMazesFromLocalStorage();
  let editingMaze = mazeId ? mazes.find((m) => m.id === mazeId) : null;

  // initialize maze cells
  const cells: Cell[] = [];
  let start = { x: 0, y: 0 };
  let goal = { x: 5, y: 5 };
  let wallCount = 0;
  let mazeName = "";

  if (editingMaze) {
    // load data for existing maze
    start = { ...editingMaze.start };
    goal = { ...editingMaze.goal };
    wallCount = editingMaze.wallCount;
    mazeName = editingMaze.name;
    editingMaze.cells.forEach((cell) => {
      cells.push(JSON.parse(JSON.stringify(cell)));
    });
  } else {
    // load data for new maze
    for (let y = 0; y < MAZE_SIZE; y++) {
      for (let x = 0; x < MAZE_SIZE; x++) {
        cells.push({
          x,
          y,
          walls: { up: false, down: false, left: false, right: false },
        });
      }
    }
  }

  let draggedMarker: "start" | "goal" | null = null;
  let currentMazeId = mazeId;
  let isSaved = true;

  // Button panel (placed at top, below title)
  const buttonPanel = document.createElement("div");
  buttonPanel.style.marginBottom = "20px";

  // control panel
  const controlPanel = document.createElement("div");
  controlPanel.style.marginBottom = "20px";

  // maze name input
  const nameLabel = document.createElement("label");
  nameLabel.textContent = "迷路名: ";
  nameLabel.style.marginRight = "5px";
  controlPanel.appendChild(nameLabel);
  const nameInput = document.createElement("input");
  nameInput.type = "text";
  nameInput.value = mazeName || "新規の迷路";
  nameInput.style.marginRight = "10px";
  nameInput.style.padding = "5px";
  controlPanel.appendChild(nameInput);

  // wall count label
  const wallCountLabel = document.createElement("div");
  wallCountLabel.style.marginTop = "10px";
  wallCountLabel.textContent = `壁の数: ${wallCount} / ${MAX_WALLS}`;
  controlPanel.appendChild(wallCountLabel);

  // hint label
  const hintLabel = document.createElement("div");
  hintLabel.style.marginTop = "5px";
  hintLabel.style.fontSize = "12px";
  hintLabel.style.color = "#666";
  hintLabel.textContent = "セル間の線をクリックして壁をトグル / S・Gはドラッグで移動";
  controlPanel.appendChild(hintLabel);

  root.appendChild(buttonPanel);
  root.appendChild(controlPanel);

  // maze grid
  const gridContainer = document.createElement("div");
  gridContainer.style.display = "inline-block";
  gridContainer.style.border = "2px solid #000";
  gridContainer.style.marginBottom = "20px";
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
      element.style.height = gridY % 2 === 0 ? `${CELL_SIZE}px` : `${WALL_SIZE}px`;
      element.style.boxSizing = "border-box";
      element.style.display = "flex";
      element.style.alignItems = "center";
      element.style.justifyContent = "center";

      if (gridY % 2 === 0 && gridX % 2 === 0) {
        const cellX = Math.floor(gridX / 2);
        const cellY = Math.floor(gridY / 2);
        element.style.backgroundColor = "#fff";
        element.style.border = "1px solid #ccc";
        element.style.position = "relative";

        element.addEventListener("dragover", (e) => {
          e.preventDefault();
          element.style.backgroundColor = "#e0e0ff";
        });

        element.addEventListener("dragleave", () => {
          element.style.backgroundColor = "#fff";
        });

        element.addEventListener("drop", (e) => {
          e.preventDefault();
          element.style.backgroundColor = "#fff";
          handleCellDrop(cellX, cellY);
        });

        // coordinate label
        const coordLabel = document.createElement("div");
        coordLabel.style.fontSize = "10px";
        coordLabel.style.color = "#999";
        coordLabel.style.position = "absolute";
        coordLabel.style.top = "2px";
        coordLabel.style.left = "2px";
        coordLabel.textContent = `${String.fromCharCode(65 + cellX)}${cellY + 1}`;
        element.appendChild(coordLabel);

        // Marker (Start/Goal)
        const marker = document.createElement("div");
        marker.style.fontSize = "48px";
        marker.style.fontWeight = "bold";
        marker.style.cursor = "grab";
        marker.dataset.cellX = String(cellX);
        marker.dataset.cellY = String(cellY);

        marker.draggable = true;
        marker.addEventListener("dragstart", (e) => {
          if (start.x === cellX && start.y === cellY) {
            draggedMarker = "start";
            marker.style.cursor = "grabbing";
          } else if (goal.x === cellX && goal.y === cellY) {
            draggedMarker = "goal";
            marker.style.cursor = "grabbing";
          }
        });

        marker.addEventListener("dragend", () => {
          marker.style.cursor = "grab";
          draggedMarker = null;
        });

        element.appendChild(marker);
      } else if (gridY % 2 === 0 && gridX % 2 === 1) {
        // Vertical wall
        const cellX = Math.floor(gridX / 2);
        const cellY = Math.floor(gridY / 2);
        element.style.backgroundColor = "#ddd";
        element.style.cursor = "pointer";
        element.dataset.wallType = "vertical";
        element.dataset.wallX = String(cellX);
        element.dataset.wallY = String(cellY);

        element.onclick = () => handleVerticalWallClick(cellX, cellY);
      } else if (gridY % 2 === 1 && gridX % 2 === 0) {
        // Horizontal wall
        const cellX = Math.floor(gridX / 2);
        const cellY = Math.floor(gridY / 2);
        element.style.backgroundColor = "#ddd";
        element.style.cursor = "pointer";
        element.dataset.wallType = "horizontal";
        element.dataset.wallX = String(cellX);
        element.dataset.wallY = String(cellY);

        element.onclick = () => handleHorizontalWallClick(cellX, cellY);
      } else {
        // Intersection
        element.style.backgroundColor = "#999";
      }

      row.appendChild(element);
    }
    gridContainer.appendChild(row);
  }

  root.appendChild(gridContainer);

  // Handle cell drop
  const handleCellDrop = (x: number, y: number) => {
    if (!draggedMarker) return;

    const oldStartX = start.x;
    const oldStartY = start.y;
    const oldGoalX = goal.x;
    const oldGoalY = goal.y;

    if (draggedMarker === "start") {
      if (goal.x === x && goal.y === y) {
        return;
      }
      start = { x, y };
    } else if (draggedMarker === "goal") {
      if (start.x === x && start.y === y) {
        return;
      }
      goal = { x, y };
    }

    if (oldStartX !== start.x || oldStartY !== start.y || oldGoalX !== goal.x || oldGoalY !== goal.y) {
      isSaved = false;
    }

    render();
  };

  // Handle vertical wall click
  const handleVerticalWallClick = (cellX: number, cellY: number) => {
    const leftCell = cells.find((c) => c.x === cellX && c.y === cellY);
    const rightCell = cells.find((c) => c.x === cellX + 1 && c.y === cellY);

    if (!leftCell || !rightCell) return;

    const hasWall = leftCell.walls.right;

    if (!hasWall && wallCount >= MAX_WALLS) {
      return;
    }

    leftCell.walls.right = !hasWall;
    rightCell.walls.left = !hasWall;
    wallCount += hasWall ? -1 : 1;
    isSaved = false;

    render();
  };

  // Handle horizontal wall click
  const handleHorizontalWallClick = (cellX: number, cellY: number) => {
    const topCell = cells.find((c) => c.x === cellX && c.y === cellY);
    const bottomCell = cells.find((c) => c.x === cellX && c.y === cellY + 1);

    if (!topCell || !bottomCell) return;

    const hasWall = topCell.walls.down;

    if (!hasWall && wallCount >= MAX_WALLS) {
      return;
    }

    topCell.walls.down = !hasWall;
    bottomCell.walls.up = !hasWall;
    wallCount += hasWall ? -1 : 1;
    isSaved = false;

    render();
  };

  // Update rendering
  const render = () => {
    wallCountLabel.textContent = `壁の数: ${wallCount} / ${MAX_WALLS}`;

    const markers = gridContainer.querySelectorAll("div[data-cell-x]");
    markers.forEach((markerEl) => {
      const marker = markerEl as HTMLElement;
      const cellX = Number(marker.dataset.cellX);
      const cellY = Number(marker.dataset.cellY);

      if (start.x === cellX && start.y === cellY) {
        marker.textContent = "S";
        marker.style.color = "#00f";
      } else if (goal.x === cellX && goal.y === cellY) {
        marker.textContent = "G";
        marker.style.color = "#f00";
      } else {
        marker.textContent = "";
      }
    });

    const verticalWalls = gridContainer.querySelectorAll("div[data-wall-type='vertical']");
    verticalWalls.forEach((wallEl) => {
      const wall = wallEl as HTMLElement;
      const cellX = Number(wall.dataset.wallX);
      const cellY = Number(wall.dataset.wallY);
      const leftCell = cells.find((c) => c.x === cellX && c.y === cellY);

      if (leftCell && leftCell.walls.right) {
        wall.style.backgroundColor = "#333";
      } else {
        wall.style.backgroundColor = "#ddd";
      }
    });

    const horizontalWalls = gridContainer.querySelectorAll("div[data-wall-type='horizontal']");
    horizontalWalls.forEach((wallEl) => {
      const wall = wallEl as HTMLElement;
      const cellX = Number(wall.dataset.wallX);
      const cellY = Number(wall.dataset.wallY);
      const topCell = cells.find((c) => c.x === cellX && c.y === cellY);

      if (topCell && topCell.walls.down) {
        wall.style.backgroundColor = "#333";
      } else {
        wall.style.backgroundColor = "#ddd";
      }
    });
  };

  render();

  // Save and action buttons
  // Back button
  const backBtn = document.createElement("button");
  backBtn.textContent = "一覧に戻る";
  backBtn.style.marginRight = "10px";
  backBtn.onclick = () => {
    if (!isSaved) {
      showConfirmDialog({
        message: "迷路を保存して戻りますか？",
        onSave: () => {
          const name = nameInput.value.trim();
          if (!name) {
            showAlertDialog("迷路の名前を入力してください");
            return false;
          }

          if (!isGoalReachable(cells, start, goal)) {
            showAlertDialog("ゴールに到達不可能な迷路です。壁の配置を確認してください。");
            return false;
          }

          if (currentMazeId) {
            const updatedMaze: Maze = {
              id: currentMazeId,
              name,
              width: MAZE_SIZE,
              height: MAZE_SIZE,
              cells: JSON.parse(JSON.stringify(cells)),
              start,
              goal,
              wallCount,
              createdAt: (mazes.find((m) => m.id === currentMazeId))?.createdAt || Date.now(),
              updatedAt: Date.now(),
            };
          } else {
            const newMazeId = `maze_${Date.now()}`;
            const maze: Maze = {
              id: newMazeId,
              name,
              width: MAZE_SIZE,
              height: MAZE_SIZE,
              cells: JSON.parse(JSON.stringify(cells)),
              start,
              goal,
              wallCount,
              createdAt: Date.now(),
              updatedAt: Date.now(),
            };
            saveMazeToLocalStorage(maze);
          }

          setSelectedMazeId(null);
          navigate("mazeSelect");
          return true;
        },
        onDiscard: () => {
          setSelectedMazeId(null);
          navigate("mazeSelect");
        },
        onCancel: () => {
        },
        root,
      });
    } else {
      setSelectedMazeId(null);
      navigate("mazeSelect");
    }
  };
  buttonPanel.appendChild(backBtn);

  // Save as new
  const newSaveBtn = document.createElement("button");
  newSaveBtn.textContent = "新規保存";
  newSaveBtn.style.marginRight = "10px";
  newSaveBtn.onclick = () => {
    const name = nameInput.value.trim();
    if (!name) {
      showAlertDialog("迷路の名前を入力してください");
      return;
    }

    if (!isGoalReachable(cells, start, goal)) {
      showAlertDialog("ゴールに到達不可能な迷路です。壁の配置を確認してください。");
      return;
    }

    const newMazeId = `maze_${Date.now()}`;
    const maze: Maze = {
      id: newMazeId,
      name,
      width: MAZE_SIZE,
      height: MAZE_SIZE,
      cells: JSON.parse(JSON.stringify(cells)),
      start,
      goal,
      wallCount,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    saveMazeToLocalStorage(maze);
    showAlertDialog(`迷路「${name}」を保存しました！`);
    
    currentMazeId = newMazeId;
    isSaved = true;
    
    overwriteSaveBtn.disabled = false;
    overwriteSaveBtn.style.opacity = "1";
  };
  buttonPanel.appendChild(newSaveBtn);

  // Overwrite save
  const overwriteSaveBtn = document.createElement("button");
  overwriteSaveBtn.textContent = "上書き保存";
  overwriteSaveBtn.style.marginRight = "10px";
  overwriteSaveBtn.disabled = !currentMazeId;
  overwriteSaveBtn.style.opacity = currentMazeId ? "1" : "0.5";
  overwriteSaveBtn.onclick = () => {
    if (!currentMazeId) {
      showAlertDialog("編集中の迷路がありません");
      return;
    }

    // chack name
    const name = nameInput.value.trim();
    if (!name) {
      showAlertDialog("迷路の名前を入力してください");
      return;
    }

    // check goal reachable
    if (!isGoalReachable(cells, start, goal)) {
      showAlertDialog("ゴールに到達不可能な迷路です。壁の配置を確認してください。");
      return;
    }

    mazes = loadMazesFromLocalStorage();
    const idx = mazes.findIndex((m) => m.id === currentMazeId);
    if (idx !== -1) {
      mazes[idx] = {
        id: currentMazeId,
        name,
        width: MAZE_SIZE,
        height: MAZE_SIZE,
        cells: JSON.parse(JSON.stringify(cells)),
        start,
        goal,
        wallCount,
        createdAt: mazes[idx].createdAt,
        updatedAt: Date.now(),
      };
      localStorage.setItem("labyrinths", JSON.stringify(mazes));
      showAlertDialog(`迷路「${name}」を保存しました！`);
      isSaved = true;
    }
  };
  buttonPanel.appendChild(overwriteSaveBtn);

  // Clear maze
  const clearBtn = document.createElement("button");
  clearBtn.textContent = "クリア";
  clearBtn.style.marginRight = "10px";
  clearBtn.onclick = () => {
    showSimpleConfirmDialog("迷路をクリアしてもよろしいですか？", () => {
      cells.forEach((cell) => {
        cell.walls = { up: false, down: false, left: false, right: false };
      });
      wallCount = 0;
      isSaved = false;
      render();
    });
  };
  buttonPanel.appendChild(clearBtn);
}
