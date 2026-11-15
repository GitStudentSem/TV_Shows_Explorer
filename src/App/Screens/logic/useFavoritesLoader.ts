import { useEffect } from "react";
import { loadFavorites } from "../../../tasks/loadFavorites";

/** Счётчик на кнопке нужен сразу, поэтому избранное грузим при старте приложения. */
export function useFavoritesLoader() {
  useEffect(() => {
    const controller = new AbortController();
    loadFavorites(controller.signal);
    return () => controller.abort();
  }, []);
}
