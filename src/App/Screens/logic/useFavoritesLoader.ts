import { useEffect } from "react";
import { loadFavoriteIds } from "./tasks/loadFavoriteIds";

/** Звёздочки и счётчик нужны сразу, поэтому id избранного грузим при старте приложения. */
export function useFavoritesLoader() {
  useEffect(() => {
    const controller = new AbortController();
    loadFavoriteIds(controller.signal);
    return () => controller.abort();
  }, []);
}
