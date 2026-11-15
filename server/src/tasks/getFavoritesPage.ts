import type { Show } from "../api/tvmaze.ts";
import { listFavorites } from "../storage/favorite.ts";
import { paginate } from "./paginate.ts";

export interface FavoritesPage {
  shows: Show[];
  totalCount: number;
  page: number;
  pageCount: number;
}

/** Страница избранного, последние добавленные — первыми. */
export function getFavoritesPage(page: number): FavoritesPage {
  const shows = listFavorites()
    .sort((a, b) => b.addedAt - a.addedAt)
    .map((entry) => entry.show);
  const { items, ...pagination } = paginate(shows, page);

  return { shows: items, totalCount: shows.length, ...pagination };
}
