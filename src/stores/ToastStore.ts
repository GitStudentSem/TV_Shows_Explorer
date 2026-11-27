import { makeAutoObservable } from "mobx";

/** Что случилось — данные, а не текст: текст собирает Presenter Toast (8.11). */
export type ToastKind =
  | "favorite-added"
  | "favorite-removed"
  | "favorite-error"
  | "session-expired";

export interface Toast {
  /** Новый id на каждый показ: так повторное одинаковое уведомление перезапускает таймер. */
  id: number;
  kind: ToastKind;
  showName: string;
}

export class ToastStore {
  current: Toast | null = null;
  #lastId = 0;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  show(kind: ToastKind, showName?: string) {
    this.#lastId += 1;
    this.current = { id: this.#lastId, kind, showName: showName || "" };
  }

  hide() {
    this.current = null;
  }
}

export const toastStore = new ToastStore();
