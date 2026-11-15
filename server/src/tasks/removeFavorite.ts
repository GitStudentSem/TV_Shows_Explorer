import { deleteFavorite } from "../storage/favorite.ts";

/** Убрать шоу из избранного. Если его там нет, это не ошибка: результат тот же. */
export function removeFavorite(id: number) {
  deleteFavorite(id);
}
