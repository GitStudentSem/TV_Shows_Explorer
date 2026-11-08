import { makeAutoObservable, runInAction } from "mobx";
import { type Show, searchShows } from "../api/tvmaze";
import { getErrorMessage } from "./getErrorMessage";

export const DEBOUNCE_MS = 400;

export type SearchStatus = "idle" | "loading" | "success" | "error";

/** Поиск сериалов: строка запроса, debounce, отмена устаревших запросов. */
export class SearchStore {
  query = "";
  status: SearchStatus = "idle";
  /** Последняя успешная выдача. Пока идёт загрузка нового запроса, не стирается. */
  shows: Show[] = [];
  errorMessage: string | null = null;
  /** Запрос, по которому получена выдача `shows` (query может уже уйти вперёд). */
  searchedTerm = "";

  #debounceTimer: ReturnType<typeof setTimeout> | undefined;
  #controller: AbortController | null = null;
  /** Запрос, к которому мы идём: ждём debounce, грузим или уже показываем. */
  #targetTerm: string | null = "";

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  setQuery(value: string) {
    this.query = value;

    const term = value.trim();
    if (term === this.#targetTerm) return;

    // Введён другой запрос: ожидание и ответ на предыдущий уже не нужны.
    this.#cancelPending();
    this.#targetTerm = term;

    if (!term) {
      this.#reset();
      return;
    }
    if (term === this.searchedTerm) {
      // Вернулись к показанному запросу до debounce: его выдача по-прежнему
      // актуальна, а вместе с ней сохраняются выбранный жанр и страница.
      this.status = "success";
      this.errorMessage = null;
      return;
    }

    // Показываем загрузку сразу, а не после debounce: иначе на быстром
    // интернете скелетон лишь мелькает на время запроса.
    this.status = "loading";
    this.errorMessage = null;
    this.#debounceTimer = setTimeout(() => this.#search(term), DEBOUNCE_MS);
  }

  /** Enter и кнопка «Повторить»: запускают поиск сразу, не дожидаясь debounce. */
  submit() {
    const term = this.query.trim();
    const isWaitingDebounce = this.#debounceTimer !== undefined;
    if (term && (isWaitingDebounce || this.status === "error")) {
      this.#search(term);
    }
  }

  #cancelPending() {
    clearTimeout(this.#debounceTimer);
    this.#debounceTimer = undefined;
    this.#controller?.abort();
    this.#controller = null;
  }

  #reset() {
    this.status = "idle";
    this.shows = [];
    this.errorMessage = null;
    this.searchedTerm = "";
  }

  async #search(term: string) {
    this.#cancelPending();
    const controller = new AbortController();
    this.#controller = controller;
    this.#targetTerm = term;
    runInAction(() => {
      this.status = "loading";
      this.errorMessage = null;
    });

    try {
      const shows = await searchShows(term, controller.signal);
      if (controller.signal.aborted) return;

      runInAction(() => {
        this.shows = shows;
        this.searchedTerm = term;
        this.status = "success";
      });
    } catch (error) {
      if (controller.signal.aborted) return;

      // Сбрасываем, чтобы тот же запрос можно было отправить повторно.
      this.#targetTerm = null;
      runInAction(() => {
        this.errorMessage = getErrorMessage(error);
        this.status = "error";
      });
    }
  }
}

export const searchStore = new SearchStore();
