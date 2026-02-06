import { navigate } from "../router.js";
import { resetClientState } from "../state.js";

export function renderTitle(root: HTMLElement) {
  // clean
  resetClientState();
  root.innerHTML = "";

  const wrapper = document.createElement("div");
  wrapper.className = "title-screen";

  // setting title
  const titleText = document.createElement("h1");
  titleText.textContent = "迷路ゲーム";
  wrapper.appendChild(titleText);

  const subtitle = document.createElement("p");
  subtitle.className = "title-subtitle";
  subtitle.textContent = "迷路を作って、相手の迷路を先にクリアしよう";
  wrapper.appendChild(subtitle);

  const actions = document.createElement("div");
  actions.className = "button-panel title-actions";

  // Navigate to lobby
  const lobbyBtn = document.createElement("button");
  lobbyBtn.textContent = "はじめる";
  lobbyBtn.className = "primary";
  lobbyBtn.onclick = () => navigate("lobby");
  actions.appendChild(lobbyBtn);

  // Navigate to maze creation
  const mazeBtn = document.createElement("button");
  mazeBtn.textContent = "迷路作成";
  mazeBtn.onclick = () => navigate("mazeSelect");
  actions.appendChild(mazeBtn);

  // GitHub link
  const githubBtn = document.createElement("button");
  githubBtn.textContent = "GitHubを見る";
  githubBtn.onclick = () => {
    window.open("https://github.com/mzgch691/labyrinth-game", "_blank");
  };
  actions.appendChild(githubBtn);

  wrapper.appendChild(actions);
  root.appendChild(wrapper);
}
