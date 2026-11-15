import { searchStore } from "../../../stores/SearchStore";

export function usePresenter() {
  const { page, result, isSearching, status } = searchStore;
  const { pageCount } = result;

  return {
    // Пока ищется новый запрос, страницы прошлой выдачи не показываем.
    isVisible: !isSearching && status !== "error" && pageCount > 1,
    isFirstPage: page === 1,
    isLastPage: page === pageCount,
    goPrev: () => searchStore.setPage(page - 1),
    goNext: () => searchStore.setPage(page + 1),
    pages: usePages(),
  };
}

function usePages() {
  const { page, result } = searchStore;

  return Array.from({ length: result.pageCount }, (_, index) => {
    const number = index + 1;
    return {
      number,
      label: String(number).padStart(2, "0"),
      ariaLabel: `Страница ${number}`,
      ariaCurrent: number === page ? ("page" as const) : undefined,
      onClick: () => searchStore.setPage(number),
    };
  });
}
