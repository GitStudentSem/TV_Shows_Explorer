import { type ApiErrorCode, isAbortError, toApiErrorCode } from "../api/client";
import { fetchFavoritesPage } from "../api/favorites";
import { favoritesPageStore } from "../stores/FavoritesPageStore";

export interface LoadFavoritesPageResult {
  error: ApiErrorCode | null;
}

/**
 * Загрузить страницу избранного по номеру из стора. Вызывают открытие канала,
 * переключатель страниц и «Повторить». Устаревший запрос отменяет `api/` (8.9.1).
 */
export async function loadFavoritesPage(): Promise<LoadFavoritesPageResult> {
  favoritesPageStore.startLoading();
  try {
    const result = await fetchFavoritesPage(favoritesPageStore.page);
    favoritesPageStore.showResult(result);
    return { error: null };
  } catch (error) {
    if (isAbortError(error)) return { error: null };

    const code = toApiErrorCode(error);
    favoritesPageStore.showError(code);
    return { error: code };
  }
}
