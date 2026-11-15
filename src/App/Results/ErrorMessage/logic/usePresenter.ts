import { searchStore } from "../../../../stores/SearchStore";
import { loadShows } from "../../../../tasks/loadShows";
import { getErrorText } from "./getErrorText";

export function usePresenter() {
  return {
    errorMessage: getErrorText(searchStore.error),
    retry: loadShows,
  };
}
