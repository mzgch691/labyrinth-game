import { navigate } from "../router.js";
import { resetClientState } from "../state.js";

export function renderTitle(root: HTMLElement) {
  // clean
  resetClientState();
  root.innerHTML = "";

  // setting title
  const titleText = document.createElement("h1");
  titleText.textContent = "タイトル画面";
  root.appendChild(titleText);

  // Navigate to lobby
  const lobbyBtn = document.createElement("button");
  lobbyBtn.textContent = "はじめる";
  lobbyBtn.onclick = () => navigate("lobby");
  root.appendChild(lobbyBtn);

  // Navigate to maze creation
  const mazeBtn = document.createElement("button");
  mazeBtn.textContent = "迷路作成";
  mazeBtn.onclick = () => navigate("mazeSelect");
  root.appendChild(mazeBtn);
}
