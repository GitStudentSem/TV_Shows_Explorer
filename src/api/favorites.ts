import { request } from "./client";
import type { Show } from "./shows";

/** Одна страница избранного: пагинацию считает сервер (9.1). */
export interface FavoritesPage {
  shows: Show[];
  totalCount: number;
  page: number;
  pageCount: number;
}

/** id всего избранного: по ним горят звёздочки и считается кнопка. */
export function fetchFavoriteIds(): Promise<number[]> {
  return request<number[]>("/api/favorites/ids");
}

/** Одновременно грузится одна страница: новый запрос отменяет предыдущий (8.9.1). */
let pageController: AbortController | null = null;

export async function fetchFavoritesPage(page: number): Promise<FavoritesPage> {
  pageController?.abort();
  const controller = new AbortController();
  pageController = controller;

  const result = await request<FavoritesPage>(`/api/favorites?page=${page}`, {
    signal: controller.signal,
  });
  // Ответ мог успеть прийти, но после него уже ушёл новый запрос.
  controller.signal.throwIfAborted();
  return result;
}

/** Сервер сам берёт данные шоу по id и возвращает их (9.1). */
export function putFavorite(id: number): Promise<Show> {
  return request<Show>(`/api/favorites/${id}`, { method: "PUT" });
}

export function deleteFavorite(id: number): Promise<void> {
  return request<void>(`/api/favorites/${id}`, { method: "DELETE" });
}
