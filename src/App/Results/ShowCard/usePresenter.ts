import type { Show } from "../../../api/tvmaze";
import type { ShowCardProps } from "./ShowCard";

/** API отдаёт описание как HTML. DOMParser не выполняет скрипты, а в разметку идёт только текст. */
function getPlainText(html: string | null): string {
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
function getMeta(show: Show): string {
  const channel = show.network?.name ?? show.webChannel?.name;
  return [getYears(show), channel, show.language].filter(Boolean).join(" · ");
}

export function usePresenter({ show }: ShowCardProps) {
  const summary = getPlainText(show.summary);
  const meta = getMeta(show);

  return {
    name: show.name,
    url: show.url,
    hasImage: show.image !== null,
    posterUrl: show.image?.medium,
    posterAlt: `Постер: ${show.name}`,
    hasRating: show.rating.average !== null,
    rating: show.rating.average,
    meta,
    hasMeta: meta !== "",
    genres: show.genres,
    hasGenres: show.genres.length > 0,
    summary,
  };
}
