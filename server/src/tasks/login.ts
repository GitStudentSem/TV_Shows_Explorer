import { randomUUID } from "node:crypto";
import { saveSession } from "../storage/session.ts";
import type { AuthErrorCode } from "./authErrorCode.ts";

export type LoginResult =
  | { error: null; token: string; email: string }
  | { error: AuthErrorCode };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_EMAIL_LENGTH = 254;

/**
 * Войти по email. Пароля нет: email и есть пользователь, поэтому избранное
 * привязано к нему, а не к сессии. Email нормализуем, чтобы A@x.ru и a@x.ru
 * были одним пользователем.
 */
export function login(rawEmail: string): LoginResult {
  const email = rawEmail.trim().toLowerCase();
  if (email.length > MAX_EMAIL_LENGTH || !EMAIL_PATTERN.test(email)) {
    return { error: "invalid-email" };
  }

  const token = randomUUID();
  saveSession(token, email);
  return { error: null, token, email };
}
