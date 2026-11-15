import { searchStore } from "../../../../../stores/SearchStore";
import { goToNextPage } from "./tasks/goToNextPage";
import { goToPrevPage } from "./tasks/goToPrevPage";

export function usePresenter() {
  const { page, result, isSearching, status } = searchStore;
  // Пока ищется новый запрос, страницы прошлой выдачи не показываем.
  // А пока меняются жанр или страница, табло остаётся гореть.
  const hasPages =
    !isSearching && status !== "error" && result.filteredCount > 0;

  return {
    page: hasPages ? page : null,
    pageCount: result.pageCount,
    onPrev: goToPrevPage,
    onNext: goToNextPage,
  };
}
