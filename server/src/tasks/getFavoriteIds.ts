import { listFavorites } from "../storage/favorite.ts";

/** id всего избранного: клиенту хватает их, чтобы зажечь звёздочки и счётчик. */
export function getFavoriteIds(): number[] {
  return listFavorites().map((entry) => entry.show.id);
}
