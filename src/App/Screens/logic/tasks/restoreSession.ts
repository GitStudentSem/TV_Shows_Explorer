import { fetchMe, hasToken } from "../../../../api/auth";
import { type ApiErrorCode, toApiErrorCode } from "../../../../api/client";
import { userStore } from "../../../../stores/UserStore";
import { endSession } from "../../../../tasks/endSession";
import { loadFavoriteIds } from "../../../../tasks/loadFavoriteIds";

export interface RestoreSessionResult {
  error: ApiErrorCode | null;
}

/**
 * Узнать, кто пользуется приложением: вошёл ли он в прошлый раз и жива ли
 * его сессия. Если жива — сразу загружаем его избранное (7.8).
 */
export async function restoreSession(): Promise<RestoreSessionResult> {
  if (!hasToken()) {
    endSession();
    return { error: null };
  }

  try {
    const user = await fetchMe();
    userStore.setUser(user.email);
  } catch (error) {
    // 401: сервер забыл сессию, токен api/ уже стёр. Сеть: пускаем гостем,
    // токен остаётся, при следующем запуске попробуем снова.
    endSession();
    return { error: toApiErrorCode(error) };
  }
  return loadFavoriteIds();
}
