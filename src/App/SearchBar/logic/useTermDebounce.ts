import { useEffect, useRef } from "react";
import { searchStore } from "../../../stores/SearchStore";

const DEBOUNCE_MS = 370;

/** Пауза во вводе перед поиском (8.9): в стор уходит уже «устоявшийся» запрос. */
export function useTermDebounce() {
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const cancel = () => {
    clearTimeout(timer.current);
    timer.current = undefined;
  };

  useEffect(() => () => clearTimeout(timer.current), []);

  return {
    /** Ввод: пустой запрос применяем сразу, остальные — после паузы. */
    schedule(term: string) {
      cancel();
      // Вернулись к текущему запросу до конца паузы — искать нечего.
      if (term === searchStore.term) return;
      if (!term) return searchStore.setTerm("");
      timer.current = setTimeout(() => {
        timer.current = undefined;
        searchStore.setTerm(term);
      }, DEBOUNCE_MS);
    },
    /** Enter: ищем сразу. Если тот же запрос упал с ошибкой, повторяем его. */
    flush() {
      cancel();
      const term = searchStore.query.trim();
      const isFailed =
        term === searchStore.term && searchStore.status === "error";
      if (isFailed) return searchStore.retry();
      searchStore.setTerm(term);
    },
  };
}
