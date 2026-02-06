import type { ClientMessage, Maze } from "../../shared/types.js";
import { navigate } from "../router.js";
import { getWS } from "../connection.js";
import { showAlertDialog } from "../components/confirmDialog.js";
import {
  getRoomId,
  resetClientState,
  getMyMaze,
  getOpponentMaze,
  getMyPlayerId,
  getAttackerId,
  getTurnNumber,
  getMyPosition,
  getOpponentPosition,
  getInferenceWallMarks,
  getMyMazeWallMarks,
  getGameOver,
  getWinnerId,
  getGameOverReason,
  getAnswerMaze,
} from "../state.js";
import { renderMazeDisplay } from "../components/mazeGrid.js";

export function renderMatch(root: HTMLElement) {
  // clean
  root.innerHTML = "";

  // setting title
  const titleText = document.createElement("h1");
  titleText.textContent = "対戦画面";
  root.appendChild(titleText);

  // Button panel
  const buttonPanel = document.createElement("div");
  buttonPanel.style.marginBottom = "20px";

  // Back to title
  const backBtn = document.createElement("button");
  backBtn.textContent = "タイトルに戻る";
  backBtn.onclick = () => {
    const ws = getWS();
    const roomId = getRoomId();

    if (ws && ws.readyState === WebSocket.OPEN && roomId !== null) {
      const msg: ClientMessage = { type: "LEAVE_MATCH", roomId };
      ws.send(JSON.stringify(msg));
    }

    resetClientState();
    navigate("title");
  };
  buttonPanel.appendChild(backBtn);
  root.appendChild(buttonPanel);

  const myMaze = getMyMaze();
  const opponentMaze = getOpponentMaze();
  const myPlayerId = getMyPlayerId();
  const attackerId = getAttackerId();
  const turnNumber = getTurnNumber();
  const myPosition = getMyPosition();
  const opponentPosition = getOpponentPosition();
  const inferenceWallMarks = getInferenceWallMarks();
  const myMazeWallMarks = getMyMazeWallMarks();
  const gameOver = getGameOver();
  const winnerId = getWinnerId();
  const gameOverReason = getGameOverReason();
  const answerMaze = getAnswerMaze();

  if (!myMaze || !opponentMaze) {
    const loadingText = document.createElement("p");
    loadingText.textContent = "迷路データを読み込み中...";
    root.appendChild(loadingText);
  } else {
    // Status panel
    const statusPanel = document.createElement("div");
    statusPanel.style.marginBottom = "15px";
    statusPanel.style.display = "flex";
    statusPanel.style.gap = "20px";
    statusPanel.style.alignItems = "center";

    const turnText = document.createElement("div");
    turnText.textContent = `ターン: ${turnNumber}`;
    statusPanel.appendChild(turnText);

    const turnState = document.createElement("div");
    if (gameOver) {
      if (myPlayerId === winnerId) {
        turnState.textContent = gameOverReason === "disconnect" ? "相手が脱落しました" : "あなたの勝ち！";
        turnState.style.color = "#0070f3";
        turnState.style.fontWeight = "bold";
      } else {
        turnState.textContent = "あなたの負け";
        turnState.style.color = "#f00";
        turnState.style.fontWeight = "bold";
      }
    } else if (myPlayerId !== null && attackerId !== null && myPlayerId === attackerId) {
      turnState.textContent = "あなたのターン";
      turnState.style.color = "#0070f3";
      turnState.style.fontWeight = "bold";
    } else {
      turnState.textContent = "相手のターン";
      turnState.style.color = "#666";
    }
    statusPanel.appendChild(turnState);

    root.appendChild(statusPanel);

    // Calculate movable cells
    const canMove = myPlayerId !== null && attackerId !== null && myPlayerId === attackerId && !gameOver;
    const movableCells: Array<{x: number, y: number}> = [];
    
    if (canMove && myPosition !== null) {
      // Check up
      if (myPosition.y > 0 && inferenceWallMarks[`${myPosition.x},${myPosition.y - 1},down`] !== "blocked") {
        movableCells.push({x: myPosition.x, y: myPosition.y - 1});
      }
      // Check down
      if (myPosition.y < opponentMaze.height - 1 && inferenceWallMarks[`${myPosition.x},${myPosition.y},down`] !== "blocked") {
        movableCells.push({x: myPosition.x, y: myPosition.y + 1});
      }
      // Check left
      if (myPosition.x > 0 && inferenceWallMarks[`${myPosition.x - 1},${myPosition.y},right`] !== "blocked") {
        movableCells.push({x: myPosition.x - 1, y: myPosition.y});
      }
      // Check right
      if (myPosition.x < opponentMaze.width - 1 && inferenceWallMarks[`${myPosition.x},${myPosition.y},right`] !== "blocked") {
        movableCells.push({x: myPosition.x + 1, y: myPosition.y});
      }
    }

    const ws = getWS();
    const onCellClick = (x: number, y: number) => {
      if (!ws || ws.readyState !== WebSocket.OPEN) return;
      if (!canMove || !myPosition) return;
      
      // Determine direction from current position to target
      let direction: "up" | "down" | "left" | "right" | null = null;
      if (x === myPosition.x && y === myPosition.y - 1) direction = "up";
      else if (x === myPosition.x && y === myPosition.y + 1) direction = "down";
      else if (x === myPosition.x - 1 && y === myPosition.y) direction = "left";
      else if (x === myPosition.x + 1 && y === myPosition.y) direction = "right";
      
      if (direction) {
        const msg: ClientMessage = { type: "MOVE", direction };
        ws.send(JSON.stringify(msg));
      }
    };

    // Maze display containers
    const mazesContainer = document.createElement("div");
    mazesContainer.style.display = "flex";
    mazesContainer.style.gap = "30px";
    mazesContainer.style.marginBottom = "20px";
    mazesContainer.style.justifyContent = "center";

    // Own maze
    const myMazeContainer = document.createElement("div");
    myMazeContainer.style.textAlign = "center";
    
    const myMazeTitle = document.createElement("h2");
    myMazeTitle.textContent = "自分の迷路";
    myMazeTitle.style.marginTop = "0";
    myMazeContainer.appendChild(myMazeTitle);
    
    renderMazeDisplay(myMazeContainer, myMaze, {
      wallMarks: myMazeWallMarks,
      blockedColor: "#f00",
      defaultColor: "#000",
      position: opponentPosition,
      positionColor: "#f00",
      isOwnMaze: true,
    });
    mazesContainer.appendChild(myMazeContainer);

    // Opponent maze (for inference)
    const opponentMazeContainer = document.createElement("div");
    opponentMazeContainer.style.textAlign = "center";
    
    const opponentMazeTitle = document.createElement("h2");
    opponentMazeTitle.textContent = "相手の迷路";
    opponentMazeTitle.style.marginTop = "0";
    opponentMazeContainer.appendChild(opponentMazeTitle);
    
    renderMazeDisplay(opponentMazeContainer, opponentMaze, {
      wallMarks: inferenceWallMarks,
      blockedColor: "#000",
      defaultColor: "#ddd",
      position: myPosition,
      positionColor: "#00f",
      isOwnMaze: false,
      showAnswer: gameOver,
      answerMaze: answerMaze,
      movableCells: movableCells,
      onCellClick: onCellClick,
    });
    mazesContainer.appendChild(opponentMazeContainer);

    root.appendChild(mazesContainer);
  }

  // Show game over alert
  if (gameOver && winnerId !== null && myPlayerId !== null) {
    setTimeout(() => {
      if (myPlayerId === winnerId) {
        if (gameOverReason === "disconnect") {
          showAlertDialog("相手が脱落しました。あなたの勝ちです！");
        } else {
          showAlertDialog("あなたの勝ちです！");
        }
      } else {
        showAlertDialog("あなたの負けです。");
      }
    }, 50);
  }
}
