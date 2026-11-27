import { postLogin } from "../../../../../api/auth";
import { type ApiErrorCode, toApiErrorCode } from "../../../../../api/client";
import { userStore } from "../../../../../stores/UserStore";
import { loadFavoriteIds } from "../../../../../tasks/loadFavoriteIds";

/** invalid-email — сценарный код: в языке входа «плохой запрос» означает «плохой email». */
export type LoginErrorCode = ApiErrorCode | "invalid-email";

export interface LoginResult {
  error: LoginErrorCode | null;
}

/** Войти по email и загрузить избранное этого пользователя. */
export async function login(email: string): Promise<LoginResult> {
  try {
    const user = await postLogin(email);
    userStore.setUser(user.email);
  } catch (error) {
    const code = toApiErrorCode(error);
    return { error: code === "bad-request" ? "invalid-email" : code };
  }
  // Не ждём: вход уже состоялся, а звёзды загорятся, когда придёт ответ.
  loadFavoriteIds();
  return { error: null };
}
