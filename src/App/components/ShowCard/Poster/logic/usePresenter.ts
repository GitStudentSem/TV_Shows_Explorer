import type { PosterProps } from "../Poster";
import styles from "../Poster.module.css";

export function usePresenter({ show }: PosterProps) {
  const posterUrl = show.image?.medium;

  return {
    hasPoster: posterUrl !== undefined,
    posterUrl,
    posterAlt: `Постер: ${show.name}`,
    imageClassName: `${styles.poster} ${styles.posterImage}`,
  };
}
