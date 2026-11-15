import { favoritesPageStore } from "../../../../../stores/FavoritesPageStore";
import {
  type LoadFavoritesPageResult,
  loadFavoritesPage,
} from "../../../../../tasks/loadFavoritesPage";

/**
 * Открыть канал «Избранное» с первой страницы. Пока канал был закрыт, в
 * избранное могли добавить сериалы, поэтому прошлую страницу не показываем.
 */
export function openFavorites(): Promise<LoadFavoritesPageResult> {
  favoritesPageStore.reset();
  return loadFavoritesPage();
}
