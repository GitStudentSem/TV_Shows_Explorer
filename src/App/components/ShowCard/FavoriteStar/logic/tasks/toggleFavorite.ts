import { ApiError, type ApiErrorCode } from "../../../../../../api/client";
import { deleteFavorite, putFavorite } from "../../../../../../api/favorites";
import type { Show } from "../../../../../../api/shows";
import { favoritesStore } from "../../../../../../stores/FavoritesStore";

export type ToggleFavoriteResult =
  | { error: null; isFavorite: boolean }
  | { error: ApiErrorCode };

/** Добавить шоу в избранное или убрать оттуда. Стор обновляем после ответа сервера. */
export async function toggleFavorite(
  show: Show,
): Promise<ToggleFavoriteResult> {
  try {
    if (favoritesStore.has(show.id)) {
      await deleteFavorite(show.id);
      favoritesStore.remove(show.id);
      return { error: null, isFavorite: false };
    }

    const saved = await putFavorite(show.id);
    favoritesStore.add(saved);
    return { error: null, isFavorite: true };
  } catch (error) {
    return { error: error instanceof ApiError ? error.code : "network" };
  }
}
