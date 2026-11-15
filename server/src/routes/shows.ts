import { Router } from "express";
import { searchShows } from "../tasks/searchShows/searchShows.ts";
import { ERROR_STATUS } from "./errorStatus.ts";

/** GET /api/shows?q=&genre=&page= — разбирает параметры и отдаёт результат задачи. */
export const showsRouter = Router();

showsRouter.get("/", async (req, res) => {
  const { q, genre, page } = req.query;

  const result = await searchShows({
    term: typeof q === "string" ? q : "",
    genre: typeof genre === "string" && genre ? genre : null,
    page: Number(page) || 1,
  });

  if (result.error) {
    res.status(ERROR_STATUS[result.error]).json({ error: result.error });
    return;
  }
  res.json(result.data);
});
