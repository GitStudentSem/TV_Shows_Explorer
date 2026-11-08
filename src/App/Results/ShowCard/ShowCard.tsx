import type { Show } from "../../../api/tvmaze";
import { ColorBars } from "../components/ColorBars/ColorBars";
import styles from "./ShowCard.module.css";
import { usePresenter } from "./usePresenter";

export interface ShowCardProps {
  show: Show;
}

export function ShowCard({ show }: ShowCardProps) {
  const {
    name,
    hasImage,
    url,
    posterUrl,
    posterAlt,
    hasRating,
    rating,
    meta,
    hasMeta,
    genres,
    hasGenres,
    summary,
  } = usePresenter({ show });

  return (
    <li>
      <article className={styles.card}>
        {hasImage ? (
          <img
            className={`${styles.poster} ${styles.posterImage}`}
            src={posterUrl}
            alt={posterAlt}
            width={210}
            height={295}
            loading="lazy"
          />
        ) : (
          <ColorBars
            className={styles.poster}
            role="img"
            aria-label="Постера нет"
          >
            <span className={styles.posterLabel}>Нет постера</span>
          </ColorBars>
        )}

        <div className={styles.body}>
          <div className={styles.heading}>
            <h2 className={styles.title}>
              <a href={url} target="_blank" rel="noreferrer">
                {name}
              </a>
            </h2>
            {hasRating && <span className={styles.rating}>★ {rating}</span>}
          </div>

          {hasMeta && <p className={styles.meta}>{meta}</p>}

          {hasGenres && (
            <ul className={styles.genres} aria-label="Жанры">
              {genres.map((genre) => (
                <li key={genre}>{genre}</li>
              ))}
            </ul>
          )}

          {summary && <p className={styles.summary}>{summary}</p>}
        </div>
      </article>
    </li>
  );
}
