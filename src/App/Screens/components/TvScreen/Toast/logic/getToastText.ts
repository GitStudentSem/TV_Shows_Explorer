import type { Toast } from "../../../../../../stores/ToastStore";

export function getToastText({ kind, showName }: Toast): string {
  switch (kind) {
    case "favorite-added":
      return `«${showName}» добавлен в избранное`;
    case "favorite-removed":
      return `«${showName}» убран из избранного`;
    case "favorite-error":
      return `Не удалось обновить избранное для «${showName}». Попробуйте ещё раз.`;
  }
}
