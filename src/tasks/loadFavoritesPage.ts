import { type ApiErrorCode, isAbortError, toApiErrorCode } from "../api/client";
import { fetchFavoritesPage } from "../api/favorites";
import { favoritesPageStore } from "../stores/FavoritesPageStore";
import { userStore } from "../stores/UserStore";
import { endSession } from "./endSession";

export interface LoadFavoritesPageResult {
  error: ApiErrorCode | null;
}

/**
 * Загрузить страницу избранного по номеру из стора. Вызывают открытие канала,
 * переключатель страниц и «Повторить». Устаревший запрос отменяет `api/` (8.9.1).
 */
export async function loadFavoritesPage(): Promise<LoadFavoritesPageResult> {
  const { email, isAuthorized } = userStore;
  if (!isAuthorized) return { error: null };

  favoritesPageStore.startLoading();
  try {
    const result = await fetchFavoritesPage(favoritesPageStore.page);
    if (userStore.email !== email) return { error: null };
    favoritesPageStore.showResult(result);
    return { error: null };
  } catch (error) {
    if (userStore.email !== email || isAbortError(error))
      return { error: null };

    const code = toApiErrorCode(error);
    if (code === "unauthorized") {
      endSession(); // экран избранного сам покажет приглашение войти
      return { error: code };
    }
    favoritesPageStore.showError(code);
    return { error: code };
  }
}
