import { searchStore } from "../../../stores/SearchStore";

export function usePresenter() {
  const { isSearching, status, result, searchedTerm } = searchStore;
  // Пока меняются жанр или страница, показываем прошлую выдачу, а не скелетон.
  const isError = !isSearching && status === "error";
  const hasSearched = !isSearching && !isError && searchedTerm !== "";
  const hasShows = result.totalCount > 0;

  return {
    isLoading: isSearching,
    isError,
    isEmpty: hasSearched && !hasShows,
    isSuccess: hasSearched && hasShows,
    foundCount: result.filteredCount,
    visibleShows: result.shows,
  };
}
