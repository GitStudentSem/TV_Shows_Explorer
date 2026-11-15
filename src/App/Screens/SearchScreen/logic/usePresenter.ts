import { searchStore } from "../../../../stores/SearchStore";
import { loadShows } from "../../../../tasks/loadShows";
import type { SearchScreenProps } from "../SearchScreen";

export function usePresenter({ isWarmingUp }: SearchScreenProps) {
  const { isSearching, status, result, searchedTerm, error } = searchStore;
  // Пока кинескоп включается, кроме него на экране ничего нет.
  const isOn = !isWarmingUp;
  // Пока меняются жанр или страница, показываем прошлую выдачу, а не скелетон.
  const isError = !isSearching && status === "error";
  const hasSearched = !isSearching && !isError && searchedTerm !== "";
  const hasShows = result.totalCount > 0;

  return {
    isWarmingUp,
    // Запроса ещё нет или поле очистили: искать нечего.
    isIdle: isOn && !isSearching && status === "idle",
    isLoading: isOn && isSearching,
    isError: isOn && isError,
    error,
    retry: loadShows,
    isEmpty: isOn && hasSearched && !hasShows,
    isSuccess: isOn && hasSearched && hasShows,
    foundCount: result.filteredCount,
    visibleShows: result.shows,
  };
}
