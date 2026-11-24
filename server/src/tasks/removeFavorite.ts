import { deleteFavorite } from "../storage/favorite.ts";

/** Убрать шоу из избранного пользователя. Если его там нет, это не ошибка: результат тот же. */
export function removeFavorite(email: string, id: number) {
  deleteFavorite(email, id);
}
