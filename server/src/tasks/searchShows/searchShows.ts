import type { Show } from "../../api/tvmaze.ts";
import { getTvmazeShows } from "../getTvmazeShows.ts";
import { type TvmazeErrorCode, toErrorCode } from "../toErrorCode.ts";
import { countGenres, type GenreOption } from "./countGenres.ts";
import { paginate } from "./paginate.ts";

export interface SearchParams {
  term: string;
  genre: string | null;
  page: number;
}

export interface ShowsPage {
  shows: Show[];
  genres: GenreOption[];
  /** Сколько найдено всего, без фильтра. */
  totalCount: number;
  /** Сколько осталось после фильтра по жанру. */
  filteredCount: number;
  page: number;
  pageCount: number;
}

export type SearchResult =
  | { error: null; data: ShowsPage }
  | { error: TvmazeErrorCode };

/** Найти сериалы, отфильтровать по жанру и отдать нужную страницу. */
export async function searchShows({
  term,
  genre,
  page,
}: SearchParams): Promise<SearchResult> {
  if (!term.trim()) return { error: null, data: buildPage([], null, 1) };

  try {
    const shows = await getTvmazeShows(term);
    return { error: null, data: buildPage(shows, genre, page) };
  } catch (error) {
    return { error: toErrorCode(error) };
  }
}

function buildPage(shows: Show[], genre: string | null, page: number) {
  const filtered = genre
    ? shows.filter((show) => show.genres.includes(genre))
    : shows;
  const { items, ...pagination } = paginate(filtered, page);

  return {
    shows: items,
    genres: countGenres(shows),
    totalCount: shows.length,
    filteredCount: filtered.length,
    ...pagination,
  };
}
