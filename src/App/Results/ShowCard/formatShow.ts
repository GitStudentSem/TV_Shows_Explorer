import type { Show } from "../../../api/tvmaze";

/** API отдаёт описание как HTML. DOMParser не выполняет скрипты, а в разметку идёт только текст. */
export function getPlainText(html: string | null): string {
  if (!html) return "";
  return (
    new DOMParser()
      .parseFromString(html, "text/html")
      .body.textContent?.trim() ?? ""
  );
}

/** Даты приходят в формате "YYYY-MM-DD". */
function getYear(date: string): string {
  return date.slice(0, 4);
}

function getYears({ premiered, ended, status }: Show): string | null {
  if (!premiered) return null;

  const start = getYear(premiered);
  if (!ended) return status === "Running" ? `${start}–…` : start;

  const end = getYear(ended);
  return end === start ? start : `${start}–${end}`;
}

/** Строка вида "2011–2019 · HBO · English". */
export function getMeta(show: Show): string {
  const channel = show.network?.name ?? show.webChannel?.name;
  return [getYears(show), channel, show.language].filter(Boolean).join(" · ");
}
