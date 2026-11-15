import { computedStruct, makeAutoObservable, observableRef } from "mobx";
import type { ApiErrorCode } from "../api/client";
import type { ShowsPage, ShowsQuery } from "../api/shows";

export type SearchStatus = "idle" | "loading" | "success" | "error";

/** Параметры запроса. `attempt` меняется на «Повторить», чтобы тот же запрос ушёл ещё раз. */
export interface ShowsRequest extends ShowsQuery {
  attempt: number;
}

const EMPTY_PAGE: ShowsPage = {
  shows: [],
  genres: [],
  totalCount: 0,
  filteredCount: 0,
  page: 1,
  pageCount: 1,
};

/** Поиск сериалов: параметры запроса и последняя полученная страница. */
export class SearchStore {
  /** Текст в поле ввода, меняется на каждый символ. */
  query = "";
  /** Запрос после debounce: по нему уходит запрос на сервер. */
  term = "";
  genre: string | null = null;
  page = 1;
  attempt = 0;

  status: SearchStatus = "idle";
  /** Последняя успешная страница. Пока грузится новая, не стирается. */
  result: ShowsPage = EMPTY_PAGE;
  /** Запрос, по которому получен `result`. */
  searchedTerm = "";
  error: ApiErrorCode | null = null;

  constructor() {
    makeAutoObservable(
      this,
      { request: computedStruct, result: observableRef },
      { autoBind: true },
    );
  }

  get request(): ShowsRequest {
    const { term, genre, page, attempt } = this;
    return { term, genre, page, attempt };
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

  /** Новый запрос — жанр и страница от прошлой выдачи больше не имеют смысла. */
  setTerm(term: string) {
    if (term === this.term) return;
    this.term = term;
    this.genre = null;
    this.page = 1;
  }

  selectGenre(genre: string | null) {
    this.genre = this.genre === genre ? null : genre;
    this.page = 1;
  }

  setPage(page: number) {
    this.page = Math.min(Math.max(page, 1), this.result.pageCount);
  }

  retry() {
    this.attempt += 1;
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
