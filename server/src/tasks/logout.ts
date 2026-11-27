import { deleteSession } from "../storage/session.ts";

/** Завершить сессию. Неизвестный токен — не ошибка: результат тот же. */
export function logout(token: string) {
  deleteSession(token);
}
