import { getMeta, getPlainText } from "./formatShow";
import type { ShowCardProps } from "./ShowCard";
import styles from "./ShowCard.module.css";

export function usePresenter({ show }: ShowCardProps) {
  const summary = getPlainText(show.summary);
  const meta = getMeta(show);
  const posterUrl = show.image?.medium;

  return {
    name: show.name,
    url: show.url,
    hasPoster: posterUrl !== undefined,
    posterUrl,
    posterAlt: `Постер: ${show.name}`,
    posterImageClassName: `${styles.poster} ${styles.posterImage}`,
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
