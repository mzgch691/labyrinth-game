// Game state
export let ready = false;
export let roomId: number | null = null;

export function getReady(): boolean {
  return ready;
}

export function setReady(value: boolean): void {
  ready = value;
}

export function getRoomId(): number | null {
  return roomId;
}

export function setRoomId(id: number | null): void {
  roomId = id;
}
