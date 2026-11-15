import type { ShowCardProps } from "../ShowCard";
import { getMeta, getPlainText } from "./formatShow";

export function usePresenter({ show }: ShowCardProps) {
  const summary = getPlainText(show.summary);
  const meta = getMeta(show);

  return {
    name: show.name,
    url: show.url,
    hasRating: show.rating.average !== null,
    rating: show.rating.average,
    meta,
    hasMeta: meta !== "",
    genres: show.genres,
    hasGenres: show.genres.length > 0,
    summary,
    hasSummary: summary !== "",
  };
}
