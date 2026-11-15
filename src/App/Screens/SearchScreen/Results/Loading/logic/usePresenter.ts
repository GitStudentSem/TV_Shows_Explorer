/** Столько же карточек, сколько сервер отдаёт на страницу. */
const SKELETON_COUNT = 3;

export function usePresenter() {
  return {
    skeletonKeys: Array.from(
      { length: SKELETON_COUNT },
      (_, index) => `skeleton-${index}`,
    ),
  };
}
