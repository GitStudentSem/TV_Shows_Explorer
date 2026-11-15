import { useState } from "react";
import type { PosterProps } from "../Poster";
import styles from "../Poster.module.css";

export function usePresenter({ show }: PosterProps) {
  const [hasLoadError, setHasLoadError] = useState(false);
  const posterUrl = show.image?.medium;

  return {
    hasPoster: posterUrl !== undefined && !hasLoadError,
    posterUrl,
    posterAlt: `Постер: ${show.name}`,
    imageClassName: `${styles.poster} ${styles.posterImage}`,
    handleError: () => setHasLoadError(true),
  };
}
