import { favoritesPageStore } from "../../../../../stores/FavoritesPageStore";
import { userStore } from "../../../../../stores/UserStore";
import {
  type LoadFavoritesPageResult,
  loadFavoritesPage,
} from "../../../../../tasks/loadFavoritesPage";

/**
 * Открыть канал «Избранное» с первой страницы. Пока канал был закрыт, в
 * избранное могли добавить сериалы, поэтому прошлую страницу не показываем.
 */
export async function openFavorites(): Promise<LoadFavoritesPageResult> {
  if (!userStore.isAuthorized) return { error: null };

  favoritesPageStore.reset();
  return loadFavoritesPage();
}
