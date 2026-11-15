import { useEffect } from "react";
import { searchStore } from "../../stores/SearchStore";
import { searchShows } from "./tasks/searchShows";

/**
 * Единственный владелец AbortController для поиска (8.9.1). Запрос меняют
 * поиск, жанры и пагинация; при каждой смене прошлый запрос отменяется.
 */
export function useShowsLoader() {
  // computed.struct: объект меняется, только когда меняются параметры.
  const { request } = searchStore;

  // Biome считает `request` стабильным, потому что он взят из импортированного
  // стора. На деле это новое значение на каждую смену параметров, и эффект
  // должен перезапускаться именно на неё.
  // biome-ignore lint/correctness/useExhaustiveDependencies: see comment above
  useEffect(() => {
    const controller = new AbortController();
    searchShows(request, controller.signal);
    return () => controller.abort();
  }, [request]);
}
