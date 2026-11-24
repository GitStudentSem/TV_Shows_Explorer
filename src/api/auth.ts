import { request } from "./client";
import { clearToken, getToken, saveToken } from "./token";

/** Кто вошёл. Токен сюда не входит: он деталь api/. */
export interface CurrentUser {
  email: string;
}

interface LoginResponse {
  token: string;
  email: string;
}

/** Войти по email. Токен запоминаем здесь, наружу отдаём только email. */
export async function postLogin(email: string): Promise<CurrentUser> {
  const response = await request<LoginResponse>("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  saveToken(response.token);
  // Сервер нормализует email (A@x.ru → a@x.ru): показываем его вариант.
  return { email: response.email };
}

/** Кто владелец сохранённого токена. Без живой сессии — ApiError("unauthorized"). */
export function fetchMe(): Promise<CurrentUser> {
  return request<CurrentUser>("/api/auth/me");
}

/** Выйти. Локально токен стираем в любом случае, даже если сервер недоступен. */
export async function postLogout(): Promise<void> {
  try {
    await request<void>("/api/auth/logout", { method: "POST" });
  } finally {
    clearToken();
  }
}

/** Есть ли сохранённая сессия: гостю при старте незачем спрашивать /me. */
export function hasToken(): boolean {
  return getToken() !== null;
}
