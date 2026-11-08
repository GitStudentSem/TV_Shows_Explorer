import { PAGE_SIZE } from "../../../stores/ShowsListStore";

export function usePresenter() {
  return {
    skeletonKeys: Array.from(
      { length: PAGE_SIZE },
      (_, index) => `skeleton-${index}`,
    ),
  };
}
