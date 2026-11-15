import { useIsSlow } from "./useIsSlow";

/** Столько же карточек, сколько сервер отдаёт на страницу. */
const SKELETON_COUNT = 3;

/**
 * Обычный ответ приходит быстрее. Если ждём дольше, скорее всего
 * сервер проснулся после простоя (холодный старт на хостинге).
 */
const WARM_UP_AFTER_MS = 4000;

export function usePresenter() {
  const isWarmingUp = useIsSlow(WARM_UP_AFTER_MS);

  return {
    isWarmingUp,
    skeletonKeys: Array.from(
      { length: SKELETON_COUNT },
      (_, index) => `skeleton-${index}`,
    ),
  };
}
