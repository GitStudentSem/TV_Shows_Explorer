import { ApiError, type ApiErrorCode } from "../../../api/client";
import { fetchShows, type ShowsQuery } from "../../../api/shows";
import { searchStore } from "../../../stores/SearchStore";

export interface SearchShowsResult {
  error: ApiErrorCode | null;
}

/**
 * Найти сериалы и положить страницу выдачи в стор.
 * Отменённый запрос ошибкой не считается: задача тихо выходит (8.10).
 */
export async function searchShows(
  query: ShowsQuery,
  signal: AbortSignal,
): Promise<SearchShowsResult> {
  if (!query.term) {
    searchStore.reset();
    return { error: null };
  }

  searchStore.startLoading();
  try {
    const result = await fetchShows(query, signal);
    if (signal.aborted) return { error: null };

    searchStore.showResult(query.term, result);
    return { error: null };
  } catch (error) {
    if (signal.aborted) return { error: null };

    const code = error instanceof ApiError ? error.code : "network";
    searchStore.showError(code);
    return { error: code };
  }
}
