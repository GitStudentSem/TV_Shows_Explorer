import { useState } from "react";
import { useFavoritesLoader } from "./useFavoritesLoader";
import { useShowsLoader } from "./useShowsLoader";

export function usePresenter() {
  useShowsLoader();
  useFavoritesLoader();

  // Какой «канал» на экране — навигация, она живёт в Presenter (1.6).
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);

  return {
    isFavoritesOpen,
    toggleFavorites: () => setIsFavoritesOpen((isOpen) => !isOpen),
  };
}
