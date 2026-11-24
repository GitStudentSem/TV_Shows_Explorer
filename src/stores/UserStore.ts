import { makeAutoObservable } from "mobx";

/** checking — при старте ещё не знаем, жива ли сохранённая сессия. */
export type UserStatus = "checking" | "guest" | "authorized";

/** Кто сейчас пользуется приложением. Токена здесь нет: он деталь api/ (7.6). */
export class UserStore {
  email: string | null = null;
  status: UserStatus = "checking";

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  get isAuthorized(): boolean {
    return this.status === "authorized";
  }

  setUser(email: string) {
    this.email = email;
    this.status = "authorized";
  }

  setGuest() {
    this.email = null;
    this.status = "guest";
  }
}

export const userStore = new UserStore();
