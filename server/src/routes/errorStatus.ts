import type { TvmazeErrorCode } from "../tasks/toErrorCode.ts";

/** Код ошибки задачи → HTTP-статус. Тело ответа — сам код: `{ error }`. */
export const ERROR_STATUS: Record<TvmazeErrorCode, number> = {
  "rate-limit": 429,
  upstream: 502,
};
