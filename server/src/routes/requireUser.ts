import type { NextFunction, Request, Response } from "express";
import { authenticate } from "../tasks/authenticate.ts";

/** Токен из заголовка `Authorization: Bearer <token>` или null, если заголовка нет. */
export function readToken(req: Request): string | null {
  const match = /^Bearer (.+)$/.exec(req.headers.authorization ?? "");
  return match?.[1] ?? null;
}

/** Пускает только с действующей сессией, email кладёт в res.locals. */
export function requireUser(req: Request, res: Response, next: NextFunction) {
  const token = readToken(req);
  const email = token ? authenticate(token) : null;

  if (!email) {
    res.status(401).json({ error: "unauthorized" });
    return;
  }
  res.locals.email = email;
  next();
}

/** Email пользователя, которого пропустил requireUser. Вызывать только за ним. */
export function getUserEmail(res: Response): string {
  return res.locals.email as string;
}
