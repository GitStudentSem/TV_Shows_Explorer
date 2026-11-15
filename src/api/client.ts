/** Адрес нашего сервера. Локально пусто: Vite проксирует /api на сервер. */
const API_URL = import.meta.env.VITE_API_URL ?? "";

/** Что пошло не так при обращении к серверу. Текст для пользователя делает Presenter (8.10). */
export type ApiErrorCode = "network" | "rate-limit" | "server";

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

/**
 * Запрос к нашему API. Любой сбой приходит как ApiError с кодом,
 * кроме отмены: её AbortError пробрасываем как есть.
 */
export async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, init);
  } catch (error) {
    if (init?.signal?.aborted) throw error;
    throw new ApiError("network");
  }

  if (!response.ok) {
    throw new ApiError(response.status === 429 ? "rate-limit" : "server");
  }
  // 204 No Content: тела нет, разбирать нечего.
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}
