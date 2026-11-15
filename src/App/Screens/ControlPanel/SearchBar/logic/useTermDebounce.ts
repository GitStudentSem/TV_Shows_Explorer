import { useEffect, useRef } from "react";
import { searchStore } from "../../../../../stores/SearchStore";
import { searchByTerm } from "./tasks/searchByTerm";

const DEBOUNCE_MS = 370;

/** Пауза во вводе перед поиском (8.9): задача получает уже «устоявшийся» запрос. */
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
      if (!term) return searchByTerm("");
      timer.current = setTimeout(() => {
        timer.current = undefined;
        searchByTerm(term);
      }, DEBOUNCE_MS);
    },
    /** Enter: ищем сразу, не дожидаясь паузы. */
    flush() {
      cancel();
      searchByTerm(searchStore.query.trim());
    },
  };
}
