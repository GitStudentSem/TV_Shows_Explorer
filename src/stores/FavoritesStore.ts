import { makeAutoObservable } from "mobx";

export type FavoritesStatus = "loading" | "ready" | "error";

/**
 * Какие сериалы в избранном: по id горят звёздочки на карточках и считается
 * кнопка. Сами сериалы постранично лежат в FavoritesPageStore.
 */
export class FavoritesStore {
  ids = new Set<number>();
  status: FavoritesStatus = "loading";

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  get count(): number {
    return this.ids.size;
  }

  has(id: number): boolean {
    return this.ids.has(id);
  }

  startLoading() {
    this.status = "loading";
  }

  setIds(ids: number[]) {
    this.ids = new Set(ids);
    this.status = "ready";
  }

  showError() {
    this.status = "error";
  }

  add(id: number) {
    this.ids.add(id);
  }

  remove(id: number) {
    this.ids.delete(id);
  }
}

export const favoritesStore = new FavoritesStore();
