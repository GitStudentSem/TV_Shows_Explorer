import { PAGE_SIZE } from "../../../stores/ShowsStore";

export function usePresenter() {
  return {
    skeletonKeys: Array.from(
      { length: PAGE_SIZE },
      (_, index) => `skeleton-${index}`,
    ),
  };
}
