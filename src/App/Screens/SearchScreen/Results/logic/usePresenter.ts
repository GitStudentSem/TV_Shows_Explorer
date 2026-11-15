import { searchStore } from "../../../../../stores/SearchStore";
import type { ResultsProps } from "../Results";

export function usePresenter({ isWarmingUp }: ResultsProps) {
  const { isSearching, status, result, searchedTerm } = searchStore;
  // Пока кинескоп включается, кроме него на экране ничего нет.
  const isOn = !isWarmingUp;
  // Пока меняются жанр или страница, показываем прошлую выдачу, а не скелетон.
  const isError = !isSearching && status === "error";
  const hasSearched = !isSearching && !isError && searchedTerm !== "";
  const hasShows = result.totalCount > 0;

  return {
    isWarmingUp,
    isLoading: isOn && isSearching,
    isError: isOn && isError,
    isEmpty: isOn && hasSearched && !hasShows,
    isSuccess: isOn && hasSearched && hasShows,
    foundCount: result.filteredCount,
    visibleShows: result.shows,
  };
}
