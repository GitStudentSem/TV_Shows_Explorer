import { showsStore } from "../../../stores/ShowsStore";

export function usePresenter() {
  return {
    query: showsStore.query.trim(),
  };
}
