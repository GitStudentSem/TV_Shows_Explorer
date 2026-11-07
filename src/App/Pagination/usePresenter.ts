import { showsStore } from "../../stores/ShowsStore";

export function usePresenter() {
  const { page, pageCount } = showsStore;
  return {
    isVisible: pageCount > 1,
    isFirstPage: page === 1,
    isLastPage: page === pageCount,
    goPrev: () => showsStore.setPage(page - 1),
    goNext: () => showsStore.setPage(page + 1),
    pages: usePages(),
  };
}

function usePages() {
  const { page, pageCount } = showsStore;

  return Array.from({ length: pageCount }, (_, index) => {
    const number = index + 1;
    return {
      number,
      label: String(number).padStart(2, "0"),
      ariaLabel: `Страница ${number}`,
      ariaCurrent: number === page ? ("page" as const) : undefined,
      onClick: () => showsStore.setPage(number),
    };
  });
}
