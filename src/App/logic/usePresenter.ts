import { useState } from "react";
import { useFavoritesLoader } from "./useFavoritesLoader";
import { useShowsLoader } from "./useShowsLoader";
import { useWarmUp } from "./useWarmUp";

export function usePresenter() {
  useShowsLoader();
  useFavoritesLoader();
  const isWarmingUp = useWarmUp();

  // Какой «канал» на экране — навигация, она живёт в Presenter (1.6).
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);

  return {
    isWarmingUp,
    isFavoritesOpen,
    toggleFavorites: () => setIsFavoritesOpen((isOpen) => !isOpen),
  };
}
