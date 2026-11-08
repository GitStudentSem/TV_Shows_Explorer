import { showsStore } from "../../stores/ShowsStore";

export function usePresenter() {
  const { status, shows, filteredShows, visibleShows } = showsStore;
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
