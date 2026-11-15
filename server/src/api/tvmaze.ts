const API_URL = "https://api.tvmaze.com";

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

interface SearchResult {
  score: number;
  show: Show;
}

/** TVmaze ответил, но с ошибкой. Сетевой сбой приходит обычной ошибкой fetch. */
export class TvmazeError extends Error {
  readonly status: number;

  constructor(status: number) {
    super(`TVmaze responded with status ${status}`);
    this.name = "TvmazeError";
    this.status = status;
  }
}

async function request<T>(path: string): Promise<T> {
  const response = await fetch(`${API_URL}${path}`);
  if (!response.ok) throw new TvmazeError(response.status);
  return response.json() as Promise<T>;
}

export async function fetchShows(term: string): Promise<Show[]> {
  const results = await request<SearchResult[]>(
    `/search/shows?q=${encodeURIComponent(term)}`,
  );
  return results.map((result) => result.show);
}

export function fetchShow(id: number): Promise<Show> {
  return request<Show>(`/shows/${id}`);
}
