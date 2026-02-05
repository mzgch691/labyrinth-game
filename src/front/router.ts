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
  switch (currentScreen) {
    case "title":
      renderTitle(app);
      break;
    case "lobby":
      renderLobby(app);
      break;
    case "match":
      renderMatch(app);
      break;
    case "mazeSelect":
      renderMazeSelect(app);
      break;
    case "mazeMake":
      renderMazeMake(app);
      break;
  }
}
