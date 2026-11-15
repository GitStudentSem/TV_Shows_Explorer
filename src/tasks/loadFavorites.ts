import { ApiError, type ApiErrorCode } from "../api/client";
import { fetchFavorites } from "../api/favorites";
import { favoritesStore } from "../stores/FavoritesStore";

export interface LoadFavoritesResult {
  error: ApiErrorCode | null;
}

/** Загрузить избранное с сервера. Вызывают App при старте и список на «Повторить». */
export async function loadFavorites(
  signal?: AbortSignal,
): Promise<LoadFavoritesResult> {
  favoritesStore.startLoading();
  try {
    const items = await fetchFavorites(signal);
    if (signal?.aborted) return { error: null };

    favoritesStore.setItems(items);
    return { error: null };
  } catch (error) {
    if (signal?.aborted) return { error: null };

    const code = error instanceof ApiError ? error.code : "network";
    favoritesStore.showError(code);
    return { error: code };
  }
}
