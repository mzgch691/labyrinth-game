import { navigate } from "../router.js";
import { setSelectedMazeId } from "../state.js";
import type { Maze } from "../../shared/types.js";
import { loadMazesFromLocalStorage } from "../utils/storage.js";
import { showSimpleConfirmDialog } from "../components/confirmDialog.js";

export function renderMazeSelect(root: HTMLElement) {
  // clean
  root.innerHTML = "";

  // setting title
  const titleText = document.createElement("h1");
  titleText.textContent = "迷路選択画面";
  root.appendChild(titleText);

  // show maze list
  showMazeList(root);
}

function showMazeList(root: HTMLElement) {
  const listContainer = document.createElement("div");
  listContainer.style.marginBottom = "20px";

  const mazes = loadMazesFromLocalStorage();
  
  // sort by updatedAt desc, createdAt desc
  mazes.sort((a, b) => (b.updatedAt || b.createdAt) - (a.updatedAt || a.createdAt));

  // format coordinate
  const formatCoordinate = (x: number, y: number): string => {
    const column = String.fromCharCode(65 + x); // 65 = 'A'
    const row = y + 1;
    return `${column}${row}`;
  };

  // button to navigate to title
  const backBtn = document.createElement("button");
  backBtn.textContent = "タイトルに戻る";
  backBtn.style.marginRight = "10px";
  backBtn.onclick = () => navigate("title");
  listContainer.appendChild(backBtn);

  // botton to navigate to mazeMake
  const newBtn = document.createElement("button");
  newBtn.textContent = "新しい迷路を作成";
  newBtn.onclick = () => {
    setSelectedMazeId(null);
    navigate("mazeMake");
  };
  listContainer.appendChild(newBtn);

  root.appendChild(listContainer);

  // list of mazes (maze is empty)
  if (mazes.length === 0) {
    const emptyMsg = document.createElement("p");
    emptyMsg.textContent = "保存済み迷路がありません";
    emptyMsg.style.color = "#999";
    root.appendChild(emptyMsg);
    return;
  }

  // list of mazes
  const tableContainer = document.createElement("div");
  tableContainer.style.marginTop = "20px";
  const table = document.createElement("table");
  table.style.borderCollapse = "collapse";
  table.style.width = "100%";

  // header
  // maze name
  const header = document.createElement("tr");
  header.style.borderBottom = "2px solid #000";
  const nameHeader = document.createElement("th");
  nameHeader.textContent = "迷路名";
  nameHeader.style.padding = "10px";
  nameHeader.style.textAlign = "left";
  header.appendChild(nameHeader);

  // start position
  const startHeader = document.createElement("th");
  startHeader.textContent = "スタート";
  startHeader.style.padding = "10px";
  startHeader.style.textAlign = "left";
  startHeader.style.width = "90px";
  header.appendChild(startHeader);

  // goal position
  const goalHeader = document.createElement("th");
  goalHeader.textContent = "ゴール";
  goalHeader.style.padding = "10px";
  goalHeader.style.textAlign = "left";
  goalHeader.style.width = "90px";
  header.appendChild(goalHeader);

  // created date
  const createdHeader = document.createElement("th");
  createdHeader.textContent = "作成日時";
  createdHeader.style.padding = "10px";
  createdHeader.style.textAlign = "left";
  createdHeader.style.width = "140px";
  header.appendChild(createdHeader);

  // updated date
  const updatedHeader = document.createElement("th");
  updatedHeader.textContent = "最終更新";
  updatedHeader.style.padding = "10px";
  updatedHeader.style.textAlign = "left";
  updatedHeader.style.width = "140px";
  header.appendChild(updatedHeader);

  // action
  const actionHeader = document.createElement("th");
  actionHeader.textContent = "操作";
  actionHeader.style.padding = "10px";
  actionHeader.style.textAlign = "center";
  actionHeader.style.width = "150px";
  header.appendChild(actionHeader);

  table.appendChild(header);

  // list of mazes
  mazes.forEach((maze) => {
    const row = document.createElement("tr");
    row.style.borderBottom = "1px solid #ccc";

    // maze name
    const nameCell = document.createElement("td");
    nameCell.textContent = maze.name;
    nameCell.style.padding = "10px";
    nameCell.style.cursor = "pointer";
    nameCell.style.color = "#0066cc";
    nameCell.onclick = () => {
      setSelectedMazeId(maze.id);
      navigate("mazeMake");
    };
    row.appendChild(nameCell);

    // start position
    const startCell = document.createElement("td");
    const startCoord = maze.start ? formatCoordinate(maze.start.x, maze.start.y) : "N/A";
    startCell.textContent = startCoord;
    startCell.style.padding = "10px";
    row.appendChild(startCell);

    // goal position
    const goalCell = document.createElement("td");
    const goalCoord = maze.goal ? formatCoordinate(maze.goal.x, maze.goal.y) : "N/A";
    goalCell.textContent = goalCoord;
    goalCell.style.padding = "10px";
    row.appendChild(goalCell);

    // created date
    const createdCell = document.createElement("td");
    const createdDate = new Date(maze.createdAt);
    createdCell.textContent = createdDate.toLocaleString("ja-JP");
    createdCell.style.padding = "10px";
    createdCell.style.fontSize = "12px";
    row.appendChild(createdCell);

    // updated date
    const updatedCell = document.createElement("td");
    const updatedDate = new Date(maze.updatedAt || maze.createdAt);
    updatedCell.textContent = updatedDate.toLocaleString("ja-JP");
    updatedCell.style.padding = "10px";
    updatedCell.style.fontSize = "12px";
    row.appendChild(updatedCell);

    // action
    const actionCell = document.createElement("td");
    actionCell.style.padding = "10px";
    actionCell.style.textAlign = "center";

    // edit button
    const editBtn = document.createElement("button");
    editBtn.textContent = "編集";
    editBtn.style.marginRight = "5px";
    editBtn.onclick = () => {
      setSelectedMazeId(maze.id);
      navigate("mazeMake");
    };
    actionCell.appendChild(editBtn);

    // delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "削除";
    deleteBtn.style.color = "#f00";
    deleteBtn.onclick = () => {
      showSimpleConfirmDialog(`迷路「${maze.name}」を削除してもよろしいですか？`, () => {
        deleteMaze(maze.id);
        root.innerHTML = "";
        renderMazeSelect(root);
      });
    };
    actionCell.appendChild(deleteBtn);

    row.appendChild(actionCell);
    table.appendChild(row);
  });

  tableContainer.appendChild(table);
  root.appendChild(tableContainer);
}

// delete maze
function deleteMaze(mazeId: string) {
  const mazes = loadMazesFromLocalStorage();
  const filtered = mazes.filter((m) => m.id !== mazeId);
  localStorage.setItem("labyrinths", JSON.stringify(filtered));
}
