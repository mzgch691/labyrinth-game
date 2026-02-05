import type { Player } from "../state/players.js";
import { tryCreateRoom } from "./room.js";

export function onReady(player: Player) {
  if (player.roomId !== null) {
    console.warn(`[IGNORED] READY in room player=${player.id}`);
    return;
  }

  player.ready = true;
  console.log(`[STATE] player=${player.id} ready=true`);

  tryCreateRoom();
}

export function onUnready(player: Player) {
  if (player.roomId !== null) {
    console.warn(`[IGNORED] UNREADY in room player=${player.id}`);
    return;
  }

  player.ready = false;
  console.log(`[STATE] player=${player.id} ready=false`);
}
