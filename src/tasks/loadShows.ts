import { ApiError, type ApiErrorCode, isAbortError } from "../api/client";
import { abortFetchShows, fetchShows } from "../api/shows";
import { searchStore } from "../stores/SearchStore";

export interface LoadShowsResult {
  error: ApiErrorCode | null;
}

/**
 * Загрузить страницу выдачи по текущим параметрам из стора. Вызывают задачи,
 * которые эти параметры меняют, и «Повторить» после ошибки.
 * Устаревший запрос отменяет `api/` (8.9.1), отмена ошибкой не считается (8.10).
 */
export async function loadShows(): Promise<LoadShowsResult> {
  const { term, genre, page } = searchStore;

  if (!term) {
    abortFetchShows();
    searchStore.reset();
    return { error: null };
  }

  searchStore.startLoading();
  try {
    const result = await fetchShows({ term, genre, page });
    searchStore.showResult(term, result);
    return { error: null };
  } catch (error) {
    if (isAbortError(error)) return { error: null };

    const code = error instanceof ApiError ? error.code : "network";
    searchStore.showError(code);
    return { error: code };
  }
}
