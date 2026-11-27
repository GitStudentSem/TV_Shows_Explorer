import type { LoginErrorCode } from "./tasks/login";

const ERROR_TEXT: Record<LoginErrorCode, string> = {
  "invalid-email": "Похоже, в адресе опечатка. Проверьте email.",
  network: "Не удалось связаться с сервером. Проверьте интернет.",
  "rate-limit": "Слишком много попыток. Подождите немного.",
  server: "Сервер вернул ошибку. Попробуйте ещё раз.",
  unauthorized: "Не удалось войти. Попробуйте ещё раз.",
  "bad-request": "Похоже, в адресе опечатка. Проверьте email.",
};

export function getLoginErrorText(code: LoginErrorCode): string {
  return ERROR_TEXT[code];
}
