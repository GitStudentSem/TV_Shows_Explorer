import { useState } from "react";
import type { Show } from "../../../../../api/shows";
import { favoritesStore } from "../../../../../stores/FavoritesStore";
import { toastStore } from "../../../../../stores/ToastStore";
import { toggleFavorite } from "./tasks/toggleFavorite";

export function usePresenter(show: Show) {
  // Загрузка одного клика нужна только этой звёздочке — локальное состояние (7.5).
  const [isPending, setIsPending] = useState(false);
  const isFavorite = favoritesStore.has(show.id);

  const handleClick = async () => {
    setIsPending(true);
    const result = await toggleFavorite(show);
    setIsPending(false);

    if (result.error) return toastStore.show("favorite-error", show.name);
    toastStore.show(
      result.isFavorite ? "favorite-added" : "favorite-removed",
      show.name,
    );
  };

  return {
    icon: isFavorite ? "✦" : "✧",
    isPressed: isFavorite,
    isDisabled: isPending,
    label: isFavorite
      ? `Убрать «${show.name}» из избранного`
      : `Добавить «${show.name}» в избранное`,
    handleClick,
  };
}
