// Maze creation state
export let selectedMazeId: string | null = null;
export let selectedMazeForPlay: string | null = null;

export function getSelectedMazeId(): string | null {
  return selectedMazeId;
}

export function setSelectedMazeId(id: string | null): void {
  selectedMazeId = id;
}

export function getSelectedMazeForPlay(): string | null {
  return selectedMazeForPlay;
}

export function setSelectedMazeForPlay(id: string | null): void {
  selectedMazeForPlay = id;
}
