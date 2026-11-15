import { request } from "./client";

export interface Show {
  id: number;
  name: string;
  genres: string[];
  language: string | null;
  premiered: string | null;
  ended: string | null;
  status: string | null;
  rating: { average: number | null };
  image: { medium: string; original: string } | null;
  network: { name: string } | null;
  webChannel: { name: string } | null;
  summary: string | null;
  url: string;
}

export interface GenreOption {
  name: string;
  count: number;
}

/** Одна страница выдачи: фильтр и пагинацию считает сервер (9.1). */
export interface ShowsPage {
  shows: Show[];
  genres: GenreOption[];
  totalCount: number;
  filteredCount: number;
  page: number;
  pageCount: number;
}

export interface ShowsQuery {
  term: string;
  genre: string | null;
  page: number;
}

/** Одновременно идёт один поиск: новый запрос отменяет предыдущий (8.9.1). */
let searchController: AbortController | null = null;

export async function fetchShows({
  term,
  genre,
  page,
}: ShowsQuery): Promise<ShowsPage> {
  abortFetchShows();
  const controller = new AbortController();
  searchController = controller;

  const params = new URLSearchParams({ q: term, page: String(page) });
  if (genre) params.set("genre", genre);
  const result = await request<ShowsPage>(`/api/shows?${params}`, {
    signal: controller.signal,
  });
  // Ответ мог успеть прийти, но после него уже ушёл новый запрос.
  controller.signal.throwIfAborted();
  return result;
}

/** Отменить текущий поиск, не начиная новый: например, когда поле очистили. */
export function abortFetchShows() {
  searchController?.abort();
  searchController = null;
}
