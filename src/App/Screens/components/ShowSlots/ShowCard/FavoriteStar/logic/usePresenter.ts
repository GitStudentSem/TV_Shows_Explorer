import { useState } from "react";
import type { Show } from "../../../../../../../api/shows";
import { favoritesStore } from "../../../../../../../stores/FavoritesStore";
import { toastStore } from "../../../../../../../stores/ToastStore";
import { toggleFavorite } from "./tasks/toggleFavorite";

export function usePresenter(show: Show) {
  // Запрос одного клика нужен только этой звёздочке — локальное состояние (7.5).
  const [isPending, setIsPending] = useState(false);
  // Звёздочка уже переключилась (optimistic UI), поэтому читаем стор как есть.
  const isFavorite = favoritesStore.has(show.id);

  const handleClick = async () => {
    // Пока сервер не ответил, повторные клики игнорируем: иначе откат одного
    // запроса перепутается с результатом другого.
    if (isPending) return;
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
    isBusy: isPending,
    label: isFavorite
      ? `Убрать «${show.name}» из избранного`
      : `Добавить «${show.name}» в избранное`,
    handleClick,
  };
}
