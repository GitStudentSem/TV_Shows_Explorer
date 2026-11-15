import { ApiError, type ApiErrorCode } from "../../../../api/client";
import { fetchFavoriteIds } from "../../../../api/favorites";
import { favoritesStore } from "../../../../stores/FavoritesStore";

export interface LoadFavoriteIdsResult {
  error: ApiErrorCode | null;
}

/** Узнать, что уже в избранном: звёздочки и счётчик нужны сразу после старта. */
export async function loadFavoriteIds(
  signal?: AbortSignal,
): Promise<LoadFavoriteIdsResult> {
  favoritesStore.startLoading();
  try {
    const ids = await fetchFavoriteIds(signal);
    if (signal?.aborted) return { error: null };

    favoritesStore.setIds(ids);
    return { error: null };
  } catch (error) {
    if (signal?.aborted) return { error: null };

    const code = error instanceof ApiError ? error.code : "network";
    favoritesStore.showError();
    return { error: code };
  }
}
