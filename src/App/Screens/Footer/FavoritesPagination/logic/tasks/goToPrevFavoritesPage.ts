import { favoritesPageStore } from "../../../../../../stores/FavoritesPageStore";
import type { LoadFavoritesPageResult } from "../../../../../../tasks/loadFavoritesPage";
import { goToFavoritesPage } from "./goToFavoritesPage";

export function goToPrevFavoritesPage(): Promise<LoadFavoritesPageResult> {
  return goToFavoritesPage(favoritesPageStore.page - 1);
}
