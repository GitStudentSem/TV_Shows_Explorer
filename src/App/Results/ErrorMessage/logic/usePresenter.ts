import { searchStore } from "../../../../stores/SearchStore";
import { getErrorText } from "./getErrorText";

export function usePresenter() {
  return {
    errorMessage: getErrorText(searchStore.error),
    retry: () => searchStore.retry(),
  };
}
