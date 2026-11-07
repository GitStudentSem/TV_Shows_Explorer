import { makeAutoObservable, runInAction } from "mobx";
import { ApiError, type Show, searchShows } from "../api/tvmaze";

export const PAGE_SIZE = 3;
export const DEBOUNCE_MS = 400;

export type SearchStatus = "idle" | "loading" | "success" | "error";

export interface GenreOption {
  name: string;
  count: number;
}

function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    return error.status === 429
      ? "Слишком много запросов. Подождите несколько секунд и попробуйте снова."
      : "Сервис TVmaze вернул ошибку. Попробуйте ещё раз.";
  }
  return "Не удалось связаться с TVmaze. Проверьте интернет и попробуйте снова.";
}

export class ShowsStore {
  query = "";
  status: SearchStatus = "idle";
  shows: Show[] = [];
  errorMessage: string | null = null;
  selectedGenre: string | null = null;
  page = 1;

  #debounceTimer: ReturnType<typeof setTimeout> | undefined;
  #controller: AbortController | null = null;
  /** Запрос, результат которого сейчас загружается или показан на экране. */
  #activeTerm: string | null = null;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  get genres(): GenreOption[] {
    const counts = new Map<string, number>();
    for (const show of this.shows) {
      for (const genre of show.genres) {
        counts.set(genre, (counts.get(genre) ?? 0) + 1);
      }
    }
    return [...counts]
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  get filteredShows(): Show[] {
    const genre = this.selectedGenre;
    return genre
      ? this.shows.filter((show) => show.genres.includes(genre))
      : this.shows;
  }

  get pageCount(): number {
    return Math.max(1, Math.ceil(this.filteredShows.length / PAGE_SIZE));
  }

  get visibleShows(): Show[] {
    const start = (this.page - 1) * PAGE_SIZE;
    return this.filteredShows.slice(start, start + PAGE_SIZE);
  }

  setQuery(value: string) {
    this.query = value;
    clearTimeout(this.#debounceTimer);

    const term = value.trim();
    if (!term) {
      this.#reset();
      return;
    }
    if (term === this.#activeTerm) return;

    // Введён другой запрос: ответ на предыдущий уже никому не нужен.
    this.#controller?.abort();
    this.#activeTerm = null;
    this.#debounceTimer = setTimeout(() => this.#search(term), DEBOUNCE_MS);
  }

  /** Enter и кнопка «Повторить»: запускают поиск сразу, не дожидаясь debounce. */
  submit() {
    clearTimeout(this.#debounceTimer);

    const term = this.query.trim();
    if (term && term !== this.#activeTerm) this.#search(term);
  }

  selectGenre(genre: string | null) {
    this.selectedGenre = this.selectedGenre === genre ? null : genre;
    this.page = 1;
  }

  setPage(page: number) {
    this.page = Math.min(Math.max(page, 1), this.pageCount);
  }

  #reset() {
    this.#controller?.abort();
    this.#activeTerm = null;
    runInAction(() => {
      this.status = "idle";
      this.shows = [];
      this.errorMessage = null;
      this.selectedGenre = null;
      this.page = 1;
    });
  }

  async #search(term: string) {
    this.#controller?.abort();
    const controller = new AbortController();
    this.#controller = controller;
    this.#activeTerm = term;

    runInAction(() => {
      this.status = "loading";
      this.shows = [];
      this.errorMessage = null;
      this.selectedGenre = null;
      this.page = 1;
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

export const showsStore = new ShowsStore();
