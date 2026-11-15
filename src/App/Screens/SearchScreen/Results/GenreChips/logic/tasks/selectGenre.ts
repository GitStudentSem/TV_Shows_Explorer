import { searchStore } from "../../../../../../../stores/SearchStore";
import {
  type LoadShowsResult,
  loadShows,
} from "../../../../../../../tasks/loadShows";

/**
 * Выбрать жанр. Повторный клик по выбранному снимает фильтр.
 * Страница прошлого фильтра к новому не подходит, поэтому начинаем с первой.
 */
export async function selectGenre(
  genre: string | null,
): Promise<LoadShowsResult> {
  const nextGenre = searchStore.genre === genre ? null : genre;
  if (nextGenre === searchStore.genre) return { error: null };

  searchStore.setGenre(nextGenre);
  searchStore.setPage(1);
  return loadShows();
}
