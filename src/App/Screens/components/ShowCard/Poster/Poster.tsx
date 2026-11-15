import type { Show } from "../../../../../api/shows";
import { ColorBars } from "../../ColorBars/ColorBars";
import { usePresenter } from "./logic/usePresenter";
import styles from "./Poster.module.css";

export interface PosterProps {
  show: Show;
}

export function Poster({ show }: PosterProps) {
  const { hasPoster, posterUrl, posterAlt, imageClassName } = usePresenter({
    show,
  });

  if (!hasPoster) {
    return (
      <ColorBars className={styles.poster} role="img" aria-label="Постера нет">
        <span className={styles.posterLabel}>Нет постера</span>
      </ColorBars>
    );
  }

  return (
    <img
      className={imageClassName}
      src={posterUrl}
      alt={posterAlt}
      width={210}
      height={295}
      loading="lazy"
    />
  );
}
