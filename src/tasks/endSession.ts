import { favoritesPageStore } from "../stores/FavoritesPageStore";
import { favoritesStore } from "../stores/FavoritesStore";
import { userStore } from "../stores/UserStore";

export function endSession() {
  userStore.setGuest();
  favoritesStore.clear();
  favoritesPageStore.reset();
}
