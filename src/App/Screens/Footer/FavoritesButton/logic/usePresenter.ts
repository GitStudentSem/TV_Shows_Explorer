import { favoritesStore } from "../../../../../stores/FavoritesStore";
import type { FavoritesButtonProps } from "../FavoritesButton";

export function usePresenter({ isOpen, onToggle }: FavoritesButtonProps) {
  const { count, status } = favoritesStore;

  return {
    icon: isOpen ? "←" : "✦",
    label: isOpen ? "К поиску" : "Избранное",
    hasCount: !isOpen,
    // Пока список грузится или не загрузился, число неизвестно.
    countText: status === "ready" ? String(count) : "…",
    isPressed: isOpen,
    handleClick: onToggle,
  };
}
