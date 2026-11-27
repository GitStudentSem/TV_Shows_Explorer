import { favoritesStore } from "../../../../../stores/FavoritesStore";
import { userStore } from "../../../../../stores/UserStore";
import type { FavoritesButtonProps } from "../types/FavoriteButtnProps";

export function usePresenter({ isOpen, onToggle }: FavoritesButtonProps) {
  const { count, status } = favoritesStore;
  const isGuest = userStore.status === "guest";
  return {
    icon: isOpen ? "←" : "✦",
    label: isOpen ? "К поиску" : "Избранное",
    hasCount: !isOpen && !isGuest,
    // Пока список грузится или не загрузился, число неизвестно.
    countText: status === "ready" ? String(count) : "…",
    isPressed: isOpen,
    handleClick: onToggle,
  };
}
