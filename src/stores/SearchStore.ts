import { makeAutoObservable, observableRef } from "mobx";
import type { ApiErrorCode } from "../api/client";
import type { ShowsPage } from "../api/shows";

export type SearchStatus = "idle" | "loading" | "success" | "error";

const EMPTY_PAGE: ShowsPage = {
  shows: [],
  genres: [],
  totalCount: 0,
  filteredCount: 0,
  page: 1,
  pageCount: 1,
};

/**
 * Поиск сериалов: параметры запроса и последняя полученная страница.
 * Только данные и простые сеттеры (8.2): что сбросить и когда грузить, решают задачи.
 */
export class SearchStore {
  /** Текст в поле ввода, меняется на каждый символ. */
  query = "";
  /** Запрос после debounce: по нему уходит запрос на сервер. */
  term = "";
  genre: string | null = null;
  page = 1;

  status: SearchStatus = "idle";
  /** Последняя успешная страница. Пока грузится новая, не стирается. */
  result: ShowsPage = EMPTY_PAGE;
  /** Запрос, по которому получен `result`. */
  searchedTerm = "";
  error: ApiErrorCode | null = null;

  constructor() {
    makeAutoObservable(this, { result: observableRef }, { autoBind: true });
  }

  /** Ищем новый запрос: ждём debounce или ответ по другому `term`. Смена жанра и страницы сюда не входит. */
  get isSearching(): boolean {
    const typed = this.query.trim();
    if (!typed) return false;
    const isWaitingDebounce = typed !== this.term;
    const isLoadingNewTerm =
      this.status === "loading" && this.term !== this.searchedTerm;
    return isWaitingDebounce || isLoadingNewTerm;
  }

  setQuery(value: string) {
    this.query = value;
  }

  setTerm(term: string) {
    this.term = term;
  }

  setGenre(genre: string | null) {
    this.genre = genre;
  }

  setPage(page: number) {
    this.page = page;
  }

  startLoading() {
    this.status = "loading";
    this.error = null;
  }

  showResult(term: string, result: ShowsPage) {
    this.status = "success";
    this.result = result;
    this.searchedTerm = term;
  }

  showError(error: ApiErrorCode) {
    this.status = "error";
    this.error = error;
  }

  reset() {
    this.status = "idle";
    this.result = EMPTY_PAGE;
    this.searchedTerm = "";
    this.error = null;
  }
}

export const searchStore = new SearchStore();
