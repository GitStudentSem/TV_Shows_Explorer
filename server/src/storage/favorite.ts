import type { Show } from "../api/tvmaze.ts";

/** Избранное в памяти процесса: email пользователя → (id шоу → запись). */
interface FavoriteEntry {
  show: Show;
  addedAt: number;
}

const favorites: Record<string, Record<number, FavoriteEntry>> = {};

export function listFavorites(email: string): FavoriteEntry[] {
  return Object.values(favorites[email] ?? {});
}

export function findFavorite(
  email: string,
  id: number,
): FavoriteEntry | undefined {
  return favorites[email]?.[id];
}

export function saveFavorite(email: string, show: Show, addedAt: number) {
  favorites[email] ??= {};
  favorites[email][show.id] = { show, addedAt };
}

export function deleteFavorite(email: string, id: number) {
  delete favorites[email]?.[id];
}
