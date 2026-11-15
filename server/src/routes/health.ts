import { Router } from "express";

/** Проверка, что сервер жив: нужна хостингу и для ручной проверки. */
export const healthRouter = Router();

healthRouter.get("/", (_req, res) => {
  res.json({ status: "ok" });
});
