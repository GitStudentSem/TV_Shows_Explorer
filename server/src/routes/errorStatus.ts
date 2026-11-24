import type { AuthErrorCode } from "../tasks/authErrorCode.ts";
import type { TvmazeErrorCode } from "../tasks/toErrorCode.ts";

/** Код ошибки задачи → HTTP-статус. Тело ответа — сам код: `{ error }`. */
export const ERROR_STATUS: Record<TvmazeErrorCode | AuthErrorCode, number> = {
  "not-found": 404,
  "rate-limit": 429,
  upstream: 502,
  "invalid-email": 400,
  unauthorized: 401,
};
