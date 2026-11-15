import { type ApiErrorCode, toApiErrorCode } from "../../../../api/client";
import { fetchFavoriteIds } from "../../../../api/favorites";
import { favoritesStore } from "../../../../stores/FavoritesStore";

export interface LoadFavoriteIdsResult {
  error: ApiErrorCode | null;
}

/** Узнать, что уже в избранном: звёздочки и счётчик нужны сразу после старта. */
export async function loadFavoriteIds(): Promise<LoadFavoriteIdsResult> {
  favoritesStore.startLoading();
  try {
    const ids = await fetchFavoriteIds();
    favoritesStore.setIds(ids);
    return { error: null };
  } catch (error) {
    const code = toApiErrorCode(error);
    favoritesStore.showError();
    return { error: code };
  }
}
