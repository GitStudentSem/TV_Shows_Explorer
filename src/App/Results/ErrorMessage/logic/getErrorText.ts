import type { ApiErrorCode } from "../../../../api/client";

const ERROR_TEXT: Record<ApiErrorCode, string> = {
  network:
    "Не удалось связаться с сервером. Проверьте интернет и попробуйте снова.",
  "rate-limit":
    "Слишком много запросов. Подождите несколько секунд и попробуйте снова.",
  server: "Сервис поиска вернул ошибку. Попробуйте ещё раз.",
};

export function getErrorText(code: ApiErrorCode | null): string {
  return code ? ERROR_TEXT[code] : "";
}
