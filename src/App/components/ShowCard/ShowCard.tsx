import type { Show } from "../../../api/shows";
import { FavoriteStar } from "./FavoriteStar/FavoriteStar";
import { usePresenter } from "./logic/usePresenter";
import { Poster } from "./Poster/Poster";
import styles from "./ShowCard.module.css";

export interface ShowCardProps {
  show: Show;
}

export function ShowCard({ show }: ShowCardProps) {
  const {
    name,
    url,
    hasRating,
    rating,
    meta,
    hasMeta,
    genres,
    hasGenres,
    summary,
    hasSummary,
  } = usePresenter({ show });

  return (
    <li>
      <article className={styles.card}>
        <Poster show={show} />

        <div className={styles.body}>
          <div className={styles.heading}>
            <h2 className={styles.title}>
              <a href={url} target="_blank" rel="noreferrer">
                {name}
              </a>
            </h2>
            <div className={styles.badges}>
              {hasRating && <span className={styles.rating}>★ {rating}</span>}
              <FavoriteStar show={show} />
            </div>
          </div>

          {hasMeta && <p className={styles.meta}>{meta}</p>}

          {hasGenres && (
            <ul className={styles.genres} aria-label="Жанры">
              {genres.map((genre) => (
                <li key={genre}>{genre}</li>
              ))}
            </ul>
          )}

          {hasSummary && <p className={styles.summary}>{summary}</p>}
        </div>
      </article>
    </li>
  );
}
