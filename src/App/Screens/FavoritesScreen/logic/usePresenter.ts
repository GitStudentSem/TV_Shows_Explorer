import { favoritesStore } from "../../../../stores/FavoritesStore";
import { loadFavorites } from "../../../../tasks/loadFavorites";

export function usePresenter() {
  const { items, status, count } = favoritesStore;
  const isReady = status === "ready";

  return {
    isLoading: status === "loading",
    isError: status === "error",
    isEmpty: isReady && count === 0,
    hasShows: isReady && count > 0,
    countText: `Сериалов: ${count}`,
    shows: items,
    retry: () => loadFavorites(),
  };
}
