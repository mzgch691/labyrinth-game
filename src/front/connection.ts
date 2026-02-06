import { navigate, getCurrentScreen } from "./router.js";
import {
  setRoomId,
  setReady,
  setMyMaze,
  setOpponentMaze,
  setMyPlayerId,
  setAttackerId,
  setTurnNumber,
  setMyPosition,
  setOpponentPosition,
  setInferenceWallMark,
  setMyMazeWallMark,
  resetWallMarks,
  getWallKey,
  getMyPlayerId,
  setGameOver,
  setWinnerId,
  setGameOverReason,
  setAnswerMaze,
} from "./state.js";
let ws: WebSocket | null = null;

export function initConnection() {
  if (!ws) {
    const isLocalHost =
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1";
    const wsUrl = isLocalHost
      ? "ws://localhost:8080"
      : "wss://labyrinth-game-41hs.onrender.com";
    ws = new WebSocket(wsUrl);
  }


  ws.onmessage = (event) => {
  const msg = JSON.parse(event.data);

  switch (msg.type) {
    case "START_MATCH":
      setRoomId(msg.roomId);
      setMyPlayerId(msg.playerId);
      setReady(false);
      navigate("match");
      break;
    case "MAZE_DATA":
      setMyMaze(msg.myMaze);
      setOpponentMaze(msg.opponentMaze);
      setMyPosition(msg.myPosition);
      setOpponentPosition(msg.opponentPosition);
      setAttackerId(msg.attackerId);
      setTurnNumber(msg.turnNumber);
      resetWallMarks();
      console.log("Received maze data:", msg);
      if (getCurrentScreen() === "match") {
        navigate("match");
      }
      break;
    case "MOVE_RESULT": {
      const myId = getMyPlayerId();
      if (myId !== null) {
        if (msg.playerId === myId) {
          setMyPosition(msg.to);
          const key = getWallKey(msg.from.x, msg.from.y, msg.direction);
          setInferenceWallMark(key, msg.success ? "open" : "blocked");
        } else {
          setOpponentPosition(msg.to);
          const key = getWallKey(msg.from.x, msg.from.y, msg.direction);
          setMyMazeWallMark(key, msg.success ? "open" : "blocked");
        }
        setAttackerId(msg.attackerId);
        setTurnNumber(msg.turnNumber);
      }

      if (getCurrentScreen() === "match") {
        navigate("match");
      }
      break;
    }
    case "GAME_OVER": {
      const myId = getMyPlayerId();
      setGameOver(true);
      setWinnerId(msg.winnerId);
      setGameOverReason(msg.reason ?? "goal");
      setAnswerMaze(msg.opponentMaze);

      navigate("match");
      break;
    }
    }
  };
}

export function getWS() {
  return ws;
}