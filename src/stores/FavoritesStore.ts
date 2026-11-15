import { makeAutoObservable, observableShallow } from "mobx";
import type { ApiErrorCode } from "../api/client";
import type { Show } from "../api/shows";

export type FavoritesStatus = "loading" | "ready" | "error";

/** Копия избранного с сервера: её читают звёздочки, кнопка со счётчиком и список. */
export class FavoritesStore {
  items: Show[] = [];
  status: FavoritesStatus = "loading";
  error: ApiErrorCode | null = null;

  constructor() {
    makeAutoObservable(this, { items: observableShallow }, { autoBind: true });
  }

  get count(): number {
    return this.items.length;
  }

  get ids(): Set<number> {
    return new Set(this.items.map((show) => show.id));
  }

  has(id: number): boolean {
    return this.ids.has(id);
  }

  indexOf(id: number): number {
    return this.items.findIndex((show) => show.id === id);
  }

  startLoading() {
    this.status = "loading";
    this.error = null;
  }

  setItems(items: Show[]) {
    this.items = items;
    this.status = "ready";
  }

  showError(error: ApiErrorCode) {
    this.status = "error";
    this.error = error;
  }

  /** Новое — первым, как отдаёт сервер. */
  add(show: Show) {
    this.items.unshift(show);
  }

  /** Вернуть на прежнее место: откат неудачного удаления. */
  insert(index: number, show: Show) {
    this.items.splice(index, 0, show);
  }

  remove(id: number) {
    this.items = this.items.filter((show) => show.id !== id);
  }
}

export const favoritesStore = new FavoritesStore();
