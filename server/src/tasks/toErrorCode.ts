import { TvmazeError } from "../api/tvmaze.ts";

/** Коды ошибок задач, которые ходят в TVmaze. Текст для пользователя делает клиент (9.6). */
export type TvmazeErrorCode = "rate-limit" | "upstream";

export function toErrorCode(error: unknown): TvmazeErrorCode {
  if (error instanceof TvmazeError && error.status === 429) return "rate-limit";
  return "upstream";
}
