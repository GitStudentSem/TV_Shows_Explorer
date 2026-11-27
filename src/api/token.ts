import { STORAGE_NAMES } from "../constants/storageNames";

/**
 * Токен сессии — деталь транспорта, его знает только api/ (7.6).
 * Держим в памяти и дублируем в localStorage, чтобы вход пережил F5.
 */
let token: string | null = load();

export function getToken(): string | null {
  return token;
}

export function saveToken(nextToken: string) {
  token = nextToken;
  try {
    localStorage.setItem(STORAGE_NAMES.TOKEN, nextToken);
  } catch {
    // Хранилище недоступно (приватный режим): сессия живёт до перезагрузки.
  }
}

export function clearToken() {
  token = null;
  try {
    localStorage.removeItem(STORAGE_NAMES.TOKEN);
  } catch {
    // Хранилище недоступно (приватный режим): сессия живёт до перезагрузки.
  }
}

function load(): string | null {
  try {
    return localStorage.getItem(STORAGE_NAMES.TOKEN);
  } catch {
    return null;
  }
}
