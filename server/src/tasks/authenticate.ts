import { findSessionEmail } from "../storage/session.ts";

/** Чья это сессия: email пользователя или null, если токен неизвестен. */
export function authenticate(token: string): string | null {
  return findSessionEmail(token) ?? null;
}
