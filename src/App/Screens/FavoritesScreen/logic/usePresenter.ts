import { useEffect } from "react";
import { favoritesPageStore } from "../../../../stores/FavoritesPageStore";
import { favoritesStore } from "../../../../stores/FavoritesStore";
import { loadFavoritesPage } from "../../../../tasks/loadFavoritesPage";
import { openFavorites } from "./tasks/openFavorites";

export function usePresenter() {
  // Канал включили — показываем его первую страницу.
  useEffect(() => {
    openFavorites();
  }, []);

  const { status, result, error } = favoritesPageStore;
  const isReady = status === "ready";

  return {
    isLoading: status === "loading",
    isError: status === "error",
    error,
    isEmpty: isReady && result.shows.length === 0,
    hasShows: isReady && result.shows.length > 0,
    // Счётчик — настоящий: снятые, но ещё видимые сериалы в него не входят.
    countText: `Сериалов: ${favoritesStore.count}`,
    shows: result.shows,
    retry: () => loadFavoritesPage(),
  };
}
