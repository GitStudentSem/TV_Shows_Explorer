import { type Request, type Response, Router } from "express";
import { addFavorite } from "../tasks/addFavorite.ts";
import { getFavoriteIds } from "../tasks/getFavoriteIds.ts";
import { getFavoritesPage } from "../tasks/getFavoritesPage.ts";
import { removeFavorite } from "../tasks/removeFavorite.ts";
import { ERROR_STATUS } from "./errorStatus.ts";

/** GET /api/favorites?page=, GET /api/favorites/ids, PUT и DELETE /api/favorites/:id. */
export const favoritesRouter = Router();

favoritesRouter.get("/", (req, res) => {
  res.json(getFavoritesPage(Number(req.query.page) || 1));
});

favoritesRouter.get("/ids", (_req, res) => {
  res.json(getFavoriteIds());
});

favoritesRouter.put("/:id", async (req, res) => {
  const id = parseId(req, res);
  if (id === null) return;

  const result = await addFavorite(id);
  if (result.error) {
    res.status(ERROR_STATUS[result.error]).json({ error: result.error });
    return;
  }
  res.json(result.show);
});

favoritesRouter.delete("/:id", (req, res) => {
  const id = parseId(req, res);
  if (id === null) return;

  removeFavorite(id);
  res.status(204).end();
});

/** id шоу — целое положительное число, иначе отвечаем 400. */
function parseId(req: Request, res: Response): number | null {
  const id = Number(req.params.id);
  if (Number.isInteger(id) && id > 0) return id;

  res.status(400).json({ error: "bad-request" });
  return null;
}
