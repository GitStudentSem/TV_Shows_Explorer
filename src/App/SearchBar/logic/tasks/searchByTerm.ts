import { searchStore } from "../../../../stores/SearchStore";
import { type LoadShowsResult, loadShows } from "../../../../tasks/loadShows";

/**
 * Искать по новому запросу. Жанр и страница от прошлой выдачи больше не имеют
 * смысла, поэтому сбрасываются. Тот же запрос повторяем, только если он упал.
 */
export async function searchByTerm(term: string): Promise<LoadShowsResult> {
  const isSameTerm = term === searchStore.term;
  if (isSameTerm && searchStore.status !== "error") return { error: null };

  searchStore.setTerm(term);
  searchStore.setGenre(null);
  searchStore.setPage(1);
  return loadShows();
}
