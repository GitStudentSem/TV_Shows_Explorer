import { fetchShows, type Show } from "../api/tvmaze.ts";
import { getCached } from "./getCached.ts";

/** Регистр и пробелы по краям на выдачу TVmaze не влияют, поэтому и кеш у них общий. */
export function getTvmazeShows(term: string): Promise<Show[]> {
  const normalized = term.trim().toLowerCase();
  return getCached(`search:${normalized}`, () => fetchShows(normalized));
}
