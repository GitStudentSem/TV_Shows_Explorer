import { searchStore } from "../../stores/SearchStore";
import { showsListStore } from "../../stores/ShowsListStore";

export function usePresenter() {
  const { status, shows } = searchStore;
  const { filteredShows, visibleShows } = showsListStore;
  const hasShows = shows.length > 0;

  return {
    isLoading: status === "loading",
    isError: status === "error",
    isEmpty: status === "success" && !hasShows,
    isSuccess: status === "success" && hasShows,
    foundCount: filteredShows.length,
    visibleShows,
  };
}
