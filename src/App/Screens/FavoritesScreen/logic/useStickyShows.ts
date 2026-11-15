import { useState } from "react";
import type { Show } from "../../../../api/shows";

/**
 * Список, из которого ничего не пропадает, пока экран открыт. Снятый со звезды
 * сериал остаётся на месте с ✧: вдруг это был промах, и его легко вернуть.
 * Новые сериалы (например, после загрузки) встают в начало, как отдаёт сервер.
 * Это состояние интерфейса (7.5): оно исчезает само, когда канал закрывают.
 */
export function useStickyShows(items: Show[]): Show[] {
  // Копия: массив стора меняется на месте (`add`), а нам нужен свой снимок.
  const [shown, setShown] = useState(() => [...items]);

  const shownIds = new Set(shown.map((show) => show.id));
  const fresh = items.filter((show) => !shownIds.has(show.id));
  if (fresh.length === 0) return shown;

  // Обновление состояния во время рендера — штатный приём React для данных,
  // зависящих от прошлого рендера: перерисовка случится сразу, без эффекта.
  const next = [...fresh, ...shown];
  setShown(next);
  return next;
}
