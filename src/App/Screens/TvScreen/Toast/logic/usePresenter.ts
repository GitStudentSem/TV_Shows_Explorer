import { useEffect } from "react";
import { toastStore } from "../../../../../stores/ToastStore";
import { getToastText } from "./getToastText";

/** Строка въезжает около секунды, остальное время её читают. */
const TOAST_MS = 4500;

export function usePresenter() {
  const toast = toastStore.current;
  const toastId = toast?.id;
  const isError = toast?.kind === "favorite-error";

  // Таймер автоскрытия — реакция интерфейса, поэтому он здесь, а не в сторе (8.11).
  // Новое уведомление меняет toastId, и cleanup снимает таймер прошлого.
  useEffect(() => {
    if (toastId === undefined) return;
    const timer = setTimeout(toastStore.hide, TOAST_MS);
    return () => clearTimeout(timer);
  }, [toastId]);

  return {
    isVisible: toast !== null,
    // Новый ключ на каждый показ: полоса остаётся, а текст въезжает заново.
    key: toastId,
    label: isError ? "Сбой" : "Срочно",
    text: toast ? getToastText(toast) : "",
    isError,
    close: toastStore.hide,
  };
}
