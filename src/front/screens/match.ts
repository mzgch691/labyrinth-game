import type { ClientMessage, Maze } from "../../shared/types.js";
import { navigate } from "../router.js";
import { getWS } from "../connection.js";
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
        turnState.textContent = "あなたの勝ち！";
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

    // Control buttons
    const controlPanel = document.createElement("div");
    controlPanel.style.marginBottom = "20px";

    const upBtn = document.createElement("button");
    const downBtn = document.createElement("button");
    const leftBtn = document.createElement("button");
    const rightBtn = document.createElement("button");

    upBtn.textContent = "↑";
    downBtn.textContent = "↓";
    leftBtn.textContent = "←";
    rightBtn.textContent = "→";

    const buttons = [upBtn, downBtn, leftBtn, rightBtn];
    buttons.forEach((btn) => {
      btn.style.marginRight = "8px";
      btn.style.width = "40px";
      btn.style.height = "40px";
      btn.style.fontSize = "18px";
    });

    const canMove = myPlayerId !== null && attackerId !== null && myPlayerId === attackerId && !gameOver;
    
    // Check if can move in each direction
    const canMoveUp = canMove && myPosition !== null && myPosition.y > 0 && 
      inferenceWallMarks[`${myPosition.x},${myPosition.y - 1},down`] !== "blocked";
    const canMoveDown = canMove && myPosition !== null && myPosition.y < opponentMaze.height - 1 && 
      inferenceWallMarks[`${myPosition.x},${myPosition.y},down`] !== "blocked";
    const canMoveLeft = canMove && myPosition !== null && myPosition.x > 0 && 
      inferenceWallMarks[`${myPosition.x - 1},${myPosition.y},right`] !== "blocked";
    const canMoveRight = canMove && myPosition !== null && myPosition.x < opponentMaze.width - 1 && 
      inferenceWallMarks[`${myPosition.x},${myPosition.y},right`] !== "blocked";

    upBtn.disabled = !canMoveUp;
    upBtn.style.opacity = canMoveUp ? "1" : "0.5";
    downBtn.disabled = !canMoveDown;
    downBtn.style.opacity = canMoveDown ? "1" : "0.5";
    leftBtn.disabled = !canMoveLeft;
    leftBtn.style.opacity = canMoveLeft ? "1" : "0.5";
    rightBtn.disabled = !canMoveRight;
    rightBtn.style.opacity = canMoveRight ? "1" : "0.5";

    const ws = getWS();
    const sendMove = (direction: "up" | "down" | "left" | "right") => {
      if (!ws || ws.readyState !== WebSocket.OPEN) return;
      if (!canMove) return;
      const msg: ClientMessage = { type: "MOVE", direction };
      ws.send(JSON.stringify(msg));
    };

    upBtn.onclick = () => sendMove("up");
    downBtn.onclick = () => sendMove("down");
    leftBtn.onclick = () => sendMove("left");
    rightBtn.onclick = () => sendMove("right");

    controlPanel.appendChild(upBtn);
    controlPanel.appendChild(downBtn);
    controlPanel.appendChild(leftBtn);
    controlPanel.appendChild(rightBtn);
    root.appendChild(controlPanel);

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
    });
    mazesContainer.appendChild(opponentMazeContainer);

    root.appendChild(mazesContainer);
  }

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
  root.appendChild(backBtn);

  // Show game over alert
  if (gameOver && winnerId !== null && myPlayerId !== null) {
    setTimeout(() => {
      if (myPlayerId === winnerId) {
        alert("あなたの勝ちです！");
      } else {
        alert("あなたの負けです。");
      }
    }, 50);
  }
}
