import { Router } from "express";
import { login } from "../tasks/login.ts";
import { logout } from "../tasks/logout.ts";
import { ERROR_STATUS } from "./errorStatus.ts";
import { getUserEmail, readToken, requireUser } from "./requireUser.ts";

/** POST /api/auth/login, GET /api/auth/me, POST /api/auth/logout. */
export const authRouter = Router();

authRouter.post("/login", (req, res) => {
  const email = typeof req.body?.email === "string" ? req.body.email : "";

  const result = login(email);
  if (result.error) {
    res.status(ERROR_STATUS[result.error]).json({ error: result.error });
    return;
  }
  res.json({ token: result.token, email: result.email });
});

authRouter.get("/me", requireUser, (_req, res) => {
  res.json({ email: getUserEmail(res) });
});

// Выход идемпотентен: без токена или с уже недействующим тоже 204.
authRouter.post("/logout", (req, res) => {
  const token = readToken(req);
  if (token) logout(token);
  res.status(204).end();
});
