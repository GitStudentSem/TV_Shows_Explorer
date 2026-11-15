import { favoritesStore } from "../../../../stores/FavoritesStore";
import { loadFavorites } from "../../../../tasks/loadFavorites";
import { useStickyShows } from "./useStickyShows";

export function usePresenter() {
  const { items, status, count } = favoritesStore;
  const shows = useStickyShows(items);
  const isReady = status === "ready";

  return {
    isLoading: status === "loading",
    isError: status === "error",
    isEmpty: isReady && shows.length === 0,
    hasShows: isReady && shows.length > 0,
    // Счётчик — настоящий: снятые, но ещё видимые сериалы в него не входят.
    countText: `Сериалов: ${count}`,
    shows,
    retry: () => loadFavorites(),
  };
}
