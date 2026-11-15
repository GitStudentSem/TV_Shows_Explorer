import { request } from "./client";
import type { Show } from "./shows";

export function fetchFavorites(signal?: AbortSignal): Promise<Show[]> {
  return request<Show[]>("/api/favorites", { signal });
}

/** Сервер сам берёт данные шоу по id и возвращает их (9.1). */
export function putFavorite(id: number): Promise<Show> {
  return request<Show>(`/api/favorites/${id}`, { method: "PUT" });
}

export function deleteFavorite(id: number): Promise<void> {
  return request<void>(`/api/favorites/${id}`, { method: "DELETE" });
}
