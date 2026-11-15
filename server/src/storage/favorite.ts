import type { Show } from "../api/tvmaze.ts";

/** Избранное в памяти процесса, одно на весь сервер. Ключ — id шоу. */
interface FavoriteEntry {
  show: Show;
  addedAt: number;
}

const favorite: Record<number, FavoriteEntry> = {};

export function listFavorites(): FavoriteEntry[] {
  return Object.values(favorite);
}

export function findFavorite(id: number): FavoriteEntry | undefined {
  return favorite[id];
}

export function saveFavorite(show: Show, addedAt: number) {
  favorite[show.id] = { show, addedAt };
}

export function deleteFavorite(id: number) {
  delete favorite[id];
}
