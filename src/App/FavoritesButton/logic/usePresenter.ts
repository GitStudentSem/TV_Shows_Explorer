import { favoritesStore } from "../../../stores/FavoritesStore";
import type { FavoritesButtonProps } from "../FavoritesButton";

export function usePresenter({ isOpen, onToggle }: FavoritesButtonProps) {
  const { count, status } = favoritesStore;

  return {
    label: isOpen ? "← К поиску" : "★ Избранное",
    // Пока список грузится или не загрузился, число неизвестно.
    hasCount: !isOpen,
    countText: status === "ready" ? String(count) : "…",
    isPressed: isOpen,
    handleClick: onToggle,
  };
}
