import type { ClientMessage, Maze } from "../../shared/types.js";
import { navigate } from "../router.js";
import { getWS } from "../connection.js";
import { getReady, setReady, getSelectedMazeForPlay, setSelectedMazeForPlay } from "../state.js";
import { loadMazesFromLocalStorage } from "../utils/storage.js";

export function renderLobby(root: HTMLElement) {
  root.innerHTML = "";

  const titleText = document.createElement("h1");
  titleText.textContent = "ロビー画面";
  root.appendChild(titleText);

  const mazes = loadMazesFromLocalStorage();

  // Button panel
  const buttonPanel = document.createElement("div");
  buttonPanel.style.marginBottom = "20px";

  // Back button
  const backBtn = document.createElement("button");
  backBtn.textContent = "タイトルに戻る";
  backBtn.style.marginRight = "10px";
  backBtn.onclick = () => {
    const ws = getWS();
    if (ws && ws.readyState === WebSocket.OPEN && getReady()) {
      ws.send(JSON.stringify({ type: "UNREADY" }));
    }
    setReady(false);
    setSelectedMazeForPlay(null);
    navigate("title");
  };
  buttonPanel.appendChild(backBtn);

  // Ready/Unready button
  const readyBtn = document.createElement("button");
  readyBtn.style.marginRight = "10px";

  // Status display
  const statusText = document.createElement("span");
  statusText.style.fontSize = "14px";
  statusText.style.color = "#666";

  const updateReadyButton = () => {
    const hasMaze = getSelectedMazeForPlay() !== null;
    const isReady = getReady();
    
    if (!hasMaze) {
      readyBtn.textContent = "準備完了";
      readyBtn.disabled = true;
      readyBtn.style.opacity = "0.5";
      statusText.textContent = "現在の状態：準備解除";
      statusText.style.color = "#666";
      statusText.style.fontWeight = "normal";
    } else if (isReady) {
      readyBtn.textContent = "準備解除";
      readyBtn.disabled = false;
      readyBtn.style.opacity = "1";
      statusText.textContent = "現在の状態：準備完了";
      statusText.style.color = "#0070f3";
      statusText.style.fontWeight = "bold";
    } else {
      readyBtn.textContent = "準備完了";
      readyBtn.disabled = false;
      readyBtn.style.opacity = "1";
      statusText.textContent = "現在の状態：準備解除";
      statusText.style.color = "#666";
      statusText.style.fontWeight = "normal";
    }
  };

  readyBtn.onclick = () => {
    const ws = getWS();
    if (!ws || ws.readyState !== WebSocket.OPEN) return;
    
    // Do nothing if maze is not selected
    const selectedMazeId = getSelectedMazeForPlay();
    if (!selectedMazeId) return;

    const next = !getReady();
    
    if (next) {
      // Send selected maze to server when READY
      const selectedMaze = mazes.find((m) => m.id === selectedMazeId);
      if (selectedMaze) {
        const submitMsg: ClientMessage = { type: "SUBMIT_MAZE", maze: selectedMaze };
        ws.send(JSON.stringify(submitMsg));
        console.log("Maze submitted:", selectedMaze.name);
      }
    }
    
    setReady(next);
    const msg: ClientMessage = { type: next ? "READY" : "UNREADY" };
    ws.send(JSON.stringify(msg));

    updateReadyButton();
  };
  buttonPanel.appendChild(readyBtn);
  buttonPanel.appendChild(statusText);

  updateReadyButton();
  root.appendChild(buttonPanel);

  // Maze selection section
  const mazeSection = document.createElement("div");
  mazeSection.style.marginBottom = "20px";
  mazeSection.style.border = "2px solid #ccc";
  mazeSection.style.padding = "15px";
  mazeSection.style.borderRadius = "8px";

  const mazeSectionTitle = document.createElement("h2");
  mazeSectionTitle.textContent = "迷路を選択";
  mazeSectionTitle.style.marginTop = "0";
  mazeSection.appendChild(mazeSectionTitle);
  
  if (mazes.length === 0) {
    const noMazeMsg = document.createElement("p");
    noMazeMsg.textContent = "保存済みの迷路がありません。まず迷路を作成してください。";
    noMazeMsg.style.color = "#999";
    mazeSection.appendChild(noMazeMsg);
  } else {
    // Maze selection dropdown
    const mazeSelectContainer = document.createElement("div");
    mazeSelectContainer.style.marginBottom = "15px";

    const mazeSelectLabel = document.createElement("label");
    mazeSelectLabel.textContent = "迷路: ";
    mazeSelectLabel.style.marginRight = "10px";
    mazeSelectContainer.appendChild(mazeSelectLabel);

    const mazeSelect = document.createElement("select");
    mazeSelect.style.padding = "5px";
    mazeSelect.style.fontSize = "14px";

    // Default option
    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "-- 迷路を選択してください --";
    mazeSelect.appendChild(defaultOption);

    // Sort and add mazes
    mazes.sort((a, b) => (b.updatedAt || b.createdAt) - (a.updatedAt || a.createdAt));
    mazes.forEach((maze) => {
      const option = document.createElement("option");
      option.value = maze.id;
      option.textContent = `${maze.name} (壁: ${maze.wallCount})`;
      mazeSelect.appendChild(option);
    });

    // Restore selected maze if available
    const currentSelectedId = getSelectedMazeForPlay();
    if (currentSelectedId) {
      mazeSelect.value = currentSelectedId;
    }

    mazeSelectContainer.appendChild(mazeSelect);
    mazeSection.appendChild(mazeSelectContainer);

    // Maze preview container
    const previewContainer = document.createElement("div");
    previewContainer.style.marginTop = "15px";
    mazeSection.appendChild(previewContainer);

    // Handle maze selection
    const updateMazePreview = () => {
      const selectedId = mazeSelect.value;
      setSelectedMazeForPlay(selectedId || null);
      
      // Update preview
      previewContainer.innerHTML = "";
      
      if (selectedId) {
        const selectedMaze = mazes.find((m) => m.id === selectedId);
        if (selectedMaze) {
          renderMazePreview(previewContainer, selectedMaze);
        }
      }
      
      // Update ready button state
      updateReadyButton();
    };

    mazeSelect.addEventListener("change", updateMazePreview);
    
    // Show initial preview
    updateMazePreview();
  }

  root.appendChild(mazeSection);
}

// Render maze preview
function renderMazePreview(container: HTMLElement, maze: Maze) {
  const PREVIEW_CELL_SIZE = 30;
  const PREVIEW_WALL_SIZE = 5;
  const MAZE_SIZE = maze.width;

  const previewTitle = document.createElement("h3");
  previewTitle.textContent = `${maze.name} のプレビュー`;
  previewTitle.style.marginTop = "0";
  previewTitle.style.marginBottom = "10px";
  container.appendChild(previewTitle);

  const gridContainer = document.createElement("div");
  gridContainer.style.display = "inline-block";
  gridContainer.style.border = "2px solid #000";
  gridContainer.style.backgroundColor = "#f5f5f5";
  gridContainer.style.overflow = "visible";

  const gridRows = MAZE_SIZE * 2 - 1;

  for (let gridY = 0; gridY < gridRows; gridY++) {
    const row = document.createElement("div");
    row.style.display = "flex";
    row.style.height = gridY % 2 === 0 ? `${PREVIEW_CELL_SIZE}px` : `${PREVIEW_WALL_SIZE}px`;
    row.style.lineHeight = "0";

    const gridCols = MAZE_SIZE * 2 - 1;

    for (let gridX = 0; gridX < gridCols; gridX++) {
      const element = document.createElement("div");
      element.style.width = gridX % 2 === 0 ? `${PREVIEW_CELL_SIZE}px` : `${PREVIEW_WALL_SIZE}px`;
      element.style.height = "100%";
      element.style.position = "relative";
      element.style.display = "flex";
      element.style.alignItems = "center";
      element.style.justifyContent = "center";
      element.style.boxSizing = "border-box";

      if (gridY % 2 === 0 && gridX % 2 === 0) {
        // Cell
        const cellX = Math.floor(gridX / 2);
        const cellY = Math.floor(gridY / 2);
        element.style.backgroundColor = "#fff";

        // Start/Goal marker
        if (maze.start.x === cellX && maze.start.y === cellY) {
          element.textContent = "S";
          element.style.fontSize = "16px";
          element.style.fontWeight = "bold";
          element.style.color = "blue";
        } else if (maze.goal.x === cellX && maze.goal.y === cellY) {
          element.textContent = "G";
          element.style.fontSize = "16px";
          element.style.fontWeight = "bold";
          element.style.color = "red";
        }
      } else if (gridY % 2 === 0 && gridX % 2 === 1) {
        // Vertical wall
        const cellX = Math.floor(gridX / 2);
        const cellY = Math.floor(gridY / 2);
        const cell = maze.cells.find((c) => c.x === cellX && c.y === cellY);
        element.style.backgroundColor = cell && cell.walls.right ? "#333" : "#ddd";
      } else if (gridY % 2 === 1 && gridX % 2 === 0) {
        // Horizontal wall
        const cellX = Math.floor(gridX / 2);
        const cellY = Math.floor(gridY / 2);
        const cell = maze.cells.find((c) => c.x === cellX && c.y === cellY);
        element.style.backgroundColor = cell && cell.walls.down ? "#333" : "#ddd";
      } else {
        // Intersection
        element.style.backgroundColor = "#999";
      }

      row.appendChild(element);
    }

    gridContainer.appendChild(row);
  }

  container.appendChild(gridContainer);

  // Maze info
  const info = document.createElement("div");
  info.style.marginTop = "10px";
  info.style.fontSize = "12px";
  info.style.color = "#666";
  const formatCoordinate = (x: number, y: number): string => {
    const column = String.fromCharCode(65 + x);
    const row = y + 1;
    return `${column}${row}`;
  };
  info.innerHTML = `
    スタート: ${formatCoordinate(maze.start.x, maze.start.y)} | 
    ゴール: ${formatCoordinate(maze.goal.x, maze.goal.y)} | 
    壁の数: ${maze.wallCount}
  `;
  container.appendChild(info);
}
