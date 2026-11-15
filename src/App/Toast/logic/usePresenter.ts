import { useEffect } from "react";
import { toastStore } from "../../../stores/ToastStore";
import { getToastText } from "./getToastText";

const TOAST_MS = 3000;

export function usePresenter() {
  const toast = toastStore.current;
  const toastId = toast?.id;

  // Таймер автоскрытия — реакция интерфейса, поэтому он здесь, а не в сторе (8.11).
  useEffect(() => {
    if (toastId === undefined) return;
    const timer = setTimeout(() => toastStore.hide(toastId), TOAST_MS);
    return () => clearTimeout(timer);
  }, [toastId]);

  return {
    isVisible: toast !== null,
    text: toast ? getToastText(toast) : "",
    isError: toast?.kind === "favorite-error",
    close: () => toastId !== undefined && toastStore.hide(toastId),
  };
}
