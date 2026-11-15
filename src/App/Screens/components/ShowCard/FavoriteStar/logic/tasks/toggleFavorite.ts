import { ApiError, type ApiErrorCode } from "../../../../../../../api/client";
import {
  deleteFavorite,
  putFavorite,
} from "../../../../../../../api/favorites";
import type { Show } from "../../../../../../../api/shows";
import { favoritesStore } from "../../../../../../../stores/FavoritesStore";

export type ToggleFavoriteResult =
  | { error: null; isFavorite: boolean }
  | { error: ApiErrorCode };

/**
 * Добавить шоу в избранное или убрать оттуда. Стор меняем сразу, не дожидаясь
 * сервера (optimistic UI), а если сервер ответил ошибкой — откатываем (7.9).
 */
export function toggleFavorite(show: Show): Promise<ToggleFavoriteResult> {
  return favoritesStore.has(show.id) ? removeFavorite(show) : addFavorite(show);
}

async function addFavorite(show: Show): Promise<ToggleFavoriteResult> {
  favoritesStore.add(show.id);
  try {
    await putFavorite(show.id);
    return { error: null, isFavorite: true };
  } catch (error) {
    favoritesStore.remove(show.id);
    return { error: toErrorCode(error) };
  }
}

async function removeFavorite(show: Show): Promise<ToggleFavoriteResult> {
  favoritesStore.remove(show.id);
  try {
    await deleteFavorite(show.id);
    return { error: null, isFavorite: false };
  } catch (error) {
    favoritesStore.add(show.id);
    return { error: toErrorCode(error) };
  }
}

function toErrorCode(error: unknown): ApiErrorCode {
  return error instanceof ApiError ? error.code : "network";
}
