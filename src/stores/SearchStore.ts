import { makeAutoObservable, runInAction } from "mobx";
import { type Show, searchShows } from "../api/tvmaze";
import { getErrorMessage } from "./getErrorMessage";

export const DEBOUNCE_MS = 400;

export type SearchStatus = "idle" | "loading" | "success" | "error";

/** Поиск сериалов: строка запроса, debounce, отмена устаревших запросов. */
export class SearchStore {
  query = "";
  status: SearchStatus = "idle";
  shows: Show[] = [];
  errorMessage: string | null = null;
  /** Запрос, по которому получена текущая выдача (query может уже уйти вперёд). */
  searchedTerm = "";

  #debounceTimer: ReturnType<typeof setTimeout> | undefined;
  #controller: AbortController | null = null;
  /** Запрос, результат которого сейчас загружается или показан на экране. */
  #activeTerm: string | null = null;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  setQuery(value: string) {
    this.query = value;
    clearTimeout(this.#debounceTimer);

    const term = value.trim();
    if (!term) {
      this.#controller?.abort();
      this.#activeTerm = null;
      this.#clearResults("idle");
      return;
    }
    if (term === this.#activeTerm) return;

    // Введён другой запрос: ответ на предыдущий уже никому не нужен.
    this.#controller?.abort();
    this.#activeTerm = null;
    // Показываем загрузку сразу, а не после debounce: иначе на быстром
    // интернете скелетон лишь мелькает на время запроса.
    this.#clearResults("loading");
    this.#debounceTimer = setTimeout(() => this.#search(term), DEBOUNCE_MS);
  }

  /** Enter и кнопка «Повторить»: запускают поиск сразу, не дожидаясь debounce. */
  submit() {
    clearTimeout(this.#debounceTimer);

    const term = this.query.trim();
    if (term && term !== this.#activeTerm) this.#search(term);
  }

  #clearResults(status: SearchStatus) {
    runInAction(() => {
      this.status = status;
      this.shows = [];
      this.errorMessage = null;
    });
  }

  async #search(term: string) {
    this.#controller?.abort();
    const controller = new AbortController();
    this.#controller = controller;
    this.#activeTerm = term;
    runInAction(() => {
      this.#clearResults("loading");
      this.searchedTerm = term;
    });

    try {
      const shows = await searchShows(term, controller.signal);
      if (controller.signal.aborted) return;

      runInAction(() => {
        this.shows = shows;
        this.status = "success";
      });
    } catch (error) {
      if (controller.signal.aborted) return;

      // Сбрасываем, чтобы тот же запрос можно было отправить повторно.
      this.#activeTerm = null;
      runInAction(() => {
        this.errorMessage = getErrorMessage(error);
        this.status = "error";
      });
    }
  }
}

export const searchStore = new SearchStore();
