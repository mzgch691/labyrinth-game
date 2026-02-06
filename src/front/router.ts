import type { Screen } from "../shared/types.js";
import { renderTitle } from "./screens/title.js";
import { renderLobby } from "./screens/lobby.js";
import { renderMatch } from "./screens/match.js";
import { renderMazeSelect } from "./screens/mazeSelect.js";
import { renderMazeMake } from "./screens/mazeMake.js";

const app = document.getElementById("app") as HTMLElement;

let currentScreen: Screen = "title";

export function navigate(next: Screen) {
  currentScreen = next;
  render();
}

export function getCurrentScreen(): Screen {
  return currentScreen;
}

function render() {
  app.innerHTML = "";
  const shell = document.createElement("div");
  shell.className = "screen-shell";
  app.appendChild(shell);
  switch (currentScreen) {
    case "title":
      renderTitle(shell);
      break;
    case "lobby":
      renderLobby(shell);
      break;
    case "match":
      renderMatch(shell);
      break;
    case "mazeSelect":
      renderMazeSelect(shell);
      break;
    case "mazeMake":
      renderMazeMake(shell);
      break;
  }
}
