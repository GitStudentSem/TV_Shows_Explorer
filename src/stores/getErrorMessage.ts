import { ApiError } from "../api/tvmaze";

export function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    return error.status === 429
      ? "Слишком много запросов. Подождите несколько секунд и попробуйте снова."
      : "Сервис TVmaze вернул ошибку. Попробуйте ещё раз.";
  }
  return "Не удалось связаться с TVmaze. Проверьте интернет и попробуйте снова.";
}
