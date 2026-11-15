import { makeAutoObservable, observableRef } from "mobx";
import type { ApiErrorCode } from "../api/client";
import type { FavoritesPage } from "../api/favorites";

export type FavoritesPageStatus = "loading" | "ready" | "error";

const EMPTY_PAGE: FavoritesPage = {
  shows: [],
  totalCount: 0,
  page: 1,
  pageCount: 1,
};

/**
 * Открытая страница канала «Избранное»: её читают список на экране и
 * переключатель страниц. Снятый со звезды сериал отсюда не убираем: он
 * остаётся на экране с ✧, пока не сменится страница (вдруг это был промах).
 */
export class FavoritesPageStore {
  page = 1;
  status: FavoritesPageStatus = "loading";
  result: FavoritesPage = EMPTY_PAGE;
  error: ApiErrorCode | null = null;

  constructor() {
    makeAutoObservable(this, { result: observableRef }, { autoBind: true });
  }

  setPage(page: number) {
    this.page = page;
  }

  startLoading() {
    this.status = "loading";
    this.error = null;
  }

  showResult(result: FavoritesPage) {
    this.status = "ready";
    this.result = result;
  }

  showError(error: ApiErrorCode) {
    this.status = "error";
    this.error = error;
  }

  /** Канал открыли заново: прошлая страница уже устарела. */
  reset() {
    this.page = 1;
    this.status = "loading";
    this.result = EMPTY_PAGE;
    this.error = null;
  }
}

export const favoritesPageStore = new FavoritesPageStore();
