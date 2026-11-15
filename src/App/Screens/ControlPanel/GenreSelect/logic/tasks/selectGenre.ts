import { searchStore } from "../../../../../../stores/SearchStore";
import {
  type LoadShowsResult,
  loadShows,
} from "../../../../../../tasks/loadShows";

/**
 * Выбрать жанр или снять фильтр (`null`). Страница прошлого фильтра к новому
 * не подходит, поэтому начинаем с первой.
 */
export async function selectGenre(
  genre: string | null,
): Promise<LoadShowsResult> {
  if (genre === searchStore.genre) return { error: null };

  searchStore.setGenre(genre);
  searchStore.setPage(1);
  return loadShows();
}
