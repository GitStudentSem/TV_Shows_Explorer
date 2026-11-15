import type { ShowSlotsProps } from "../ShowSlots";

/** Столько сериалов на экране. Совпадает с PAGE_SIZE на сервере. */
const SLOT_COUNT = 3;

export function usePresenter({ shows }: ShowSlotsProps) {
  const emptyCount = Math.max(SLOT_COUNT - shows.length, 0);

  return {
    shows,
    emptySlotKeys: Array.from(
      { length: emptyCount },
      (_, index) => `empty-${SLOT_COUNT - emptyCount + index}`,
    ),
  };
}
