import { searchStore } from "../../../stores/SearchStore";

export function usePresenter() {
  return {
    searchedTerm: searchStore.searchedTerm,
  };
}
