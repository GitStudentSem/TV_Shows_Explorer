import { useState } from "react";
import { useNavigate } from "react-router";
import type { Show } from "../../../../../../../api/shows";
import { favoritesStore } from "../../../../../../../stores/FavoritesStore";
import { toastStore } from "../../../../../../../stores/ToastStore";
import { userStore } from "../../../../../../../stores/UserStore";
import { toggleFavorite } from "./tasks/toggleFavorite";

export function usePresenter(show: Show) {
  // Запрос одного клика нужен только этой звёздочке — локальное состояние (7.5).
  const [isPending, setIsPending] = useState(false);
  // Звёздочка уже переключилась (optimistic UI), поэтому читаем стор как есть.
  const isFavorite = favoritesStore.has(show.id);
  const navigate = useNavigate();
  const isAuthorized = userStore.isAuthorized;

  const handleClick = async () => {
    // Гостя ведём на вход. Это навигация, поэтому она в Presenter, а не в задаче (1.6).
    if (!isAuthorized) return navigate("/login");
    // Пока сервер не ответил, повторные клики игнорируем: иначе откат одного
    // запроса перепутается с результатом другого.
    if (isPending) return;
    setIsPending(true);
    const result = await toggleFavorite(show);
    setIsPending(false);

    if (result.error === "unauthorized") {
      toastStore.show("session-expired");
      return navigate("/login");
    }
    if (result.error) return toastStore.show("favorite-error", show.name);
  };

  return {
    icon: isFavorite ? "✦" : "✧",
    isPressed: isFavorite,
    isBusy: isPending,
    label: !isAuthorized
      ? `Войдите, чтобы добавить «${show.name}» в избранное`
      : isFavorite
        ? `Убрать «${show.name}» из избранного`
        : `Добавить «${show.name}» в избранное`,
    handleClick,
  };
}
