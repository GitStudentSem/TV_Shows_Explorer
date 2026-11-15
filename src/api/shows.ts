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

export function fetchShows(
  { term, genre, page }: ShowsQuery,
  signal: AbortSignal,
): Promise<ShowsPage> {
  const params = new URLSearchParams({ q: term, page: String(page) });
  if (genre) params.set("genre", genre);
  return request<ShowsPage>(`/api/shows?${params}`, { signal });
}
