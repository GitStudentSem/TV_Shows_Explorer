import { favoritesPageStore } from "../../../../../../stores/FavoritesPageStore";
import {
  type LoadFavoritesPageResult,
  loadFavoritesPage,
} from "../../../../../../tasks/loadFavoritesPage";

/**
 * Перейти на страницу избранного. Номер за пределами прижимаем к краю.
 * Снятые со звезды сериалы при этом уходят с экрана: страницу даёт сервер.
 */
export async function goToFavoritesPage(
  page: number,
): Promise<LoadFavoritesPageResult> {
  const { pageCount } = favoritesPageStore.result;
  const nextPage = Math.min(Math.max(page, 1), pageCount);
  if (nextPage === favoritesPageStore.page) return { error: null };

  favoritesPageStore.setPage(nextPage);
  return loadFavoritesPage();
}
