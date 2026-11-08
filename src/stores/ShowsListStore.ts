import { makeAutoObservable, reaction } from "mobx";
import type { Show } from "../api/tvmaze";
import { type SearchStore, searchStore } from "./SearchStore";

export const PAGE_SIZE = 3;

export interface GenreOption {
  name: string;
  count: number;
}

/** Найденные сериалы: фильтр по жанру и разбиение на страницы. */
export class ShowsListStore {
  selectedGenre: string | null = null;
  page = 1;

  #search: SearchStore;

  constructor(search: SearchStore) {
    this.#search = search;
    makeAutoObservable(this, {}, { autoBind: true });

    // Новая выдача — фильтр и страница от прошлой больше не имеют смысла.
    reaction(
      () => this.#search.shows,
      () => this.#resetFilters(),
    );
  }

  get totalCount(): number {
    return this.#search.shows.length;
  }

  get genres(): GenreOption[] {
    const counts = new Map<string, number>();
    for (const show of this.#search.shows) {
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
    const shows = this.#search.shows;
    return genre ? shows.filter((show) => show.genres.includes(genre)) : shows;
  }

  get pageCount(): number {
    return Math.max(1, Math.ceil(this.filteredShows.length / PAGE_SIZE));
  }

  get visibleShows(): Show[] {
    const start = (this.page - 1) * PAGE_SIZE;
    return this.filteredShows.slice(start, start + PAGE_SIZE);
  }

  selectGenre(genre: string | null) {
    this.selectedGenre = this.selectedGenre === genre ? null : genre;
    this.page = 1;
  }

  setPage(page: number) {
    this.page = Math.min(Math.max(page, 1), this.pageCount);
  }

  #resetFilters() {
    this.selectedGenre = null;
    this.page = 1;
  }
}

export const showsListStore = new ShowsListStore(searchStore);
