import { searchStore } from "../../../stores/SearchStore";

export function usePresenter() {
  return {
    errorMessage: searchStore.errorMessage,
    retry: () => searchStore.submit(),
  };
}
