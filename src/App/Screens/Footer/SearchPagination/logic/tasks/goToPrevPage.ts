import { searchStore } from "../../../../../../stores/SearchStore";
import type { LoadShowsResult } from "../../../../../../tasks/loadShows";
import { goToPage } from "./goToPage";

export function goToPrevPage(): Promise<LoadShowsResult> {
  return goToPage(searchStore.page - 1);
}
