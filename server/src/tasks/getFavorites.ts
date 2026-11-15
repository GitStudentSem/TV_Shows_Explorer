import type { Show } from "../api/tvmaze.ts";
import { listFavorites } from "../storage/favorite.ts";

/** Избранное, последние добавленные — первыми. */
export function getFavorites(): Show[] {
  return listFavorites()
    .sort((a, b) => b.addedAt - a.addedAt)
    .map((entry) => entry.show);
}
