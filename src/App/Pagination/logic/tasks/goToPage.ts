import { searchStore } from "../../../../stores/SearchStore";
import { type LoadShowsResult, loadShows } from "../../../../tasks/loadShows";

/** Перейти на страницу выдачи. Номер за пределами выдачи прижимаем к краю. */
export async function goToPage(page: number): Promise<LoadShowsResult> {
  const { pageCount } = searchStore.result;
  const nextPage = Math.min(Math.max(page, 1), pageCount);
  if (nextPage === searchStore.page) return { error: null };

  searchStore.setPage(nextPage);
  return loadShows();
}
