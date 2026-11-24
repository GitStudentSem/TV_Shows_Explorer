/** Сессии в памяти процесса: токен → email. Пропадают при перезапуске сервера (9.7). */
const session: Record<string, string> = {};

export function saveSession(token: string, email: string) {
  session[token] = email;
}

export function findSessionEmail(token: string): string | undefined {
  return session[token];
}

export function deleteSession(token: string) {
  delete session[token];
}
