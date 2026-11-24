import { clearToken, getToken } from "./token";

/** Адрес нашего сервера. Локально пусто: Vite проксирует /api на сервер. */
const API_URL = import.meta.env.VITE_API_URL ?? "";

/** Что пошло не так при обращении к серверу. Текст для пользователя делает Presenter (8.10). */
export type ApiErrorCode =
  | "network"
  | "rate-limit"
  | "server"
  | "unauthorized" // 401: токена нет или сервер его забыл (Render заснул)
  | "bad-request"; // 400: сервер отверг параметры, например кривой email

const STATUS_CODE: Partial<Record<number, ApiErrorCode>> = {
  400: "bad-request",
  401: "unauthorized",
  429: "rate-limit",
};

export class ApiError extends Error {
  readonly code: ApiErrorCode;

  constructor(code: ApiErrorCode) {
    super(`API request failed: ${code}`);
    this.name = "ApiError";
    this.code = code;
  }
}

/** Запрос отменили: это не ошибка, задача молча выходит (8.10). */
export function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === "AbortError";
}

/** Код любой ошибки запроса: ApiError несёт свой, остальное считаем сетевым сбоем. */
export function toApiErrorCode(error: unknown): ApiErrorCode {
  return error instanceof ApiError ? error.code : "network";
}

/**
 * Запрос к нашему API. Любой сбой приходит как ApiError с кодом,
 * кроме отмены: её AbortError пробрасываем как есть.
 */
export async function request<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const token = getToken();
  const headers = new Headers(init.headers);
  if (token) headers.set("Authorization", `Bearer ${token}`);

  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, { ...init, headers });
  } catch (error) {
    if (init.signal?.aborted) throw error;
    throw new ApiError("network");
  }

  if (!response.ok) {
    // Сервер не знает этот токен: хранить его дальше бессмысленно.
    // Стираем, только если за время запроса не появился новый (вошли заново).
    if (response.status === 401 && getToken() === token) clearToken();
    throw new ApiError(STATUS_CODE[response.status] ?? "server");
  }
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}
