import { useEffect } from "react";
import { favoritesPageStore } from "../../../../stores/FavoritesPageStore";
import { favoritesStore } from "../../../../stores/FavoritesStore";
import { userStore } from "../../../../stores/UserStore";
import { loadFavoritesPage } from "../../../../tasks/loadFavoritesPage";
import { openFavorites } from "./tasks/openFavorites";

export function usePresenter() {
  // Канал включили — показываем его первую страницу.
  useEffect(() => {
    openFavorites();
  }, []);

  const { status, result, error } = favoritesPageStore;
  const isReady = status === "ready";
  const isGuest = userStore.status === "guest";

  return {
    isGuest,
    isLoading: !isGuest && status === "loading",
    isError: !isGuest && status === "error",
    isEmpty: !isGuest && isReady && result.shows.length === 0,
    hasShows: !isGuest && isReady && result.shows.length > 0,
    error,
    // Счётчик — настоящий: снятые, но ещё видимые сериалы в него не входят.
    countText: `Сериалов: ${favoritesStore.count}`,
    shows: result.shows,
    retry: () => loadFavoritesPage(),
  };
}
