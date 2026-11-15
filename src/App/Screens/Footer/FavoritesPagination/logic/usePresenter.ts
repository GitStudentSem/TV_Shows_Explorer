import { favoritesPageStore } from "../../../../../stores/FavoritesPageStore";
import { goToNextFavoritesPage } from "./tasks/goToNextFavoritesPage";
import { goToPrevFavoritesPage } from "./tasks/goToPrevFavoritesPage";

export function usePresenter() {
  const { page, status, result } = favoritesPageStore;
  // Пока листаем, табло показывает новую страницу, а не гаснет.
  const hasPages = status !== "error" && result.totalCount > 0;

  return {
    page: hasPages ? page : null,
    pageCount: result.pageCount,
    onPrev: goToPrevFavoritesPage,
    onNext: goToNextFavoritesPage,
  };
}
