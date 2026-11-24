import { listFavorites } from "../storage/favorite.ts";

/** id избранного пользователя: клиенту хватает их, чтобы зажечь звёздочки и счётчик. */
export function getFavoriteIds(email: string): number[] {
  return listFavorites(email).map((entry) => entry.show.id);
}
