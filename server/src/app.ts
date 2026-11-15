import cors from "cors";
import express from "express";
import { healthRouter } from "./routes/health.ts";
import { showsRouter } from "./routes/shows.ts";

/** Сборка HTTP-приложения: общие middleware и роуты. Порт задаёт index.ts. */
export function createApp() {
  const app = express();

  // В проде разрешаем только домен клиента, локально — любой источник.
  app.use(cors({ origin: process.env.CORS_ORIGIN ?? true }));
  app.use(express.json());

  app.use("/api/health", healthRouter);
  app.use("/api/shows", showsRouter);

  return app;
}
