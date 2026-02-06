// Integrated state management module
// Each state is managed in files under state/ directory

// From gameState.js
export { getReady, setReady, getRoomId, setRoomId } from "./state/gameState.js";

// From mazeState.js
export { getSelectedMazeId, setSelectedMazeId, getSelectedMazeForPlay, setSelectedMazeForPlay } from "./state/mazeState.js";

// From matchState.js
export {
  getMyMaze,
  setMyMaze,
  getOpponentMaze,
  setOpponentMaze,
  getMyPlayerId,
  setMyPlayerId,
  getAttackerId,
  setAttackerId,
  getTurnNumber,
  setTurnNumber,
  getMyPosition,
  setMyPosition,
  getOpponentPosition,
  setOpponentPosition,
  getInferenceWallMarks,
  setInferenceWallMark,
  getMyMazeWallMarks,
  setMyMazeWallMark,
  resetWallMarks,
  getGameOver,
  setGameOver,
  getWinnerId,
  setWinnerId,
  getGameOverReason,
  setGameOverReason,
  getAnswerMaze,
  setAnswerMaze,
  getWallKey,
  resetMatchState,
} from "./state/matchState.js";

// Reset all state
export async function resetClientState(): Promise<void> {
  const gameState = await import("./state/gameState.js");
  const mazeState = await import("./state/mazeState.js");
  const matchState = await import("./state/matchState.js");

  gameState.setReady(false);
  gameState.setRoomId(null);
  mazeState.setSelectedMazeId(null);
  mazeState.setSelectedMazeForPlay(null);
  matchState.resetMatchState();
}
