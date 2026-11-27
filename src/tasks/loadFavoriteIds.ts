import { type ApiErrorCode, toApiErrorCode } from "../api/client";
import { fetchFavoriteIds } from "../api/favorites";
import { favoritesStore } from "../stores/FavoritesStore";
import { userStore } from "../stores/UserStore";
import { endSession } from "./endSession";

export interface LoadFavoriteIdsResult {
  error: ApiErrorCode | null;
}

/** Узнать, что в избранном у текущего пользователя: по id горят звёздочки и считается кнопка. */
export async function loadFavoriteIds(): Promise<LoadFavoriteIdsResult> {
  const email = userStore.email;
  favoritesStore.startLoading();
  try {
    const ids = await fetchFavoriteIds();
    // Пока ждали ответ, пользователь вышел или вошёл другой: ответ чужой.
    if (userStore.email !== email) return { error: null };
    favoritesStore.setIds(ids);
    return { error: null };
  } catch (error) {
    if (userStore.email !== email) return { error: null };
    const code = toApiErrorCode(error);
    if (code === "unauthorized") endSession();
    else favoritesStore.showError();
    return { error: code };
  }
}
