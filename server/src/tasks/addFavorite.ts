import { fetchShow, type Show } from "../api/tvmaze.ts";
import { findFavorite, saveFavorite } from "../storage/favorite.ts";
import { getCached } from "./getCached.ts";
import { type TvmazeErrorCode, toErrorCode } from "./toErrorCode.ts";

export type AddFavoriteResult =
  | { error: null; show: Show }
  | { error: TvmazeErrorCode };

/**
 * Добавить шоу в избранное по id. Данные шоу сервер берёт у TVmaze сам
 * (через кеш), клиенту достаточно прислать id. Повторное добавление ничего
 * не меняет.
 */
export async function addFavorite(id: number): Promise<AddFavoriteResult> {
  const existing = findFavorite(id);
  if (existing) return { error: null, show: existing.show };

  try {
    const show = await getCached(`show:${id}`, () => fetchShow(id));
    saveFavorite(show, Date.now());
    return { error: null, show };
  } catch (error) {
    return { error: toErrorCode(error) };
  }
}
