import { searchStore } from "../../stores/SearchStore";
import { showsListStore } from "../../stores/ShowsListStore";

export function usePresenter() {
  const { page, pageCount } = showsListStore;
  return {
    // Во время загрузки в сторе лежит прежняя выдача — её страницы не показываем.
    isVisible: searchStore.status === "success" && pageCount > 1,
    isFirstPage: page === 1,
    isLastPage: page === pageCount,
    goPrev: () => showsListStore.setPage(page - 1),
    goNext: () => showsListStore.setPage(page + 1),
    pages: usePages(),
  };
}

function usePages() {
  const { page, pageCount } = showsListStore;

  return Array.from({ length: pageCount }, (_, index) => {
    const number = index + 1;
    return {
      number,
      label: String(number).padStart(2, "0"),
      ariaLabel: `Страница ${number}`,
      ariaCurrent: number === page ? ("page" as const) : undefined,
      onClick: () => showsListStore.setPage(number),
    };
  });
}
