import { favoritesPageStore } from "../../../../../../stores/FavoritesPageStore";
import type { LoadFavoritesPageResult } from "../../../../../../tasks/loadFavoritesPage";
import { goToFavoritesPage } from "./goToFavoritesPage";

export function goToNextFavoritesPage(): Promise<LoadFavoritesPageResult> {
  return goToFavoritesPage(favoritesPageStore.page + 1);
}
