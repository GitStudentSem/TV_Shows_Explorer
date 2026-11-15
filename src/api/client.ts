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
  return response.json() as Promise<T>;
}
