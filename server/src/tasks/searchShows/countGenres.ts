import type { Show } from "../../api/tvmaze.ts";

export interface GenreOption {
  name: string;
  count: number;
}

/** Жанры всей выдачи с числом сериалов в каждом, по алфавиту. */
export function countGenres(shows: Show[]): GenreOption[] {
  const counts = new Map<string, number>();
  for (const show of shows) {
    for (const genre of show.genres) {
      counts.set(genre, (counts.get(genre) ?? 0) + 1);
    }
  }
  return [...counts]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => a.name.localeCompare(b.name));
}
