import { searchStore } from "../../../stores/SearchStore";

export function usePresenter() {
  return {
    query: searchStore.query.trim(),
  };
}
