import type { Show } from "../../../api/tvmaze";
import { ColorBars } from "../components/ColorBars/ColorBars";
import styles from "./ShowCard.module.css";

interface ShowCardProps {
  show: Show;
}

/** API отдаёт описание как HTML. DOMParser не выполняет скрипты, а в разметку идёт только текст. */
function getPlainText(html: string | null): string {
  if (!html) return "";
  return (
    new DOMParser()
      .parseFromString(html, "text/html")
      .body.textContent?.trim() ?? ""
  );
}

function getYears({ premiered, ended, status }: Show): string | null {
  if (!premiered) return null;
  const start = premiered.slice(0, 4);
  if (ended)
    return ended.slice(0, 4) === start
      ? start
      : `${start}–${ended.slice(0, 4)}`;
  return status === "Running" ? `${start}–…` : start;
}

export function ShowCard({ show }: ShowCardProps) {
  const summary = getPlainText(show.summary);
  const channel = show.network?.name ?? show.webChannel?.name;
  const meta = [getYears(show), channel, show.language].filter(Boolean);

  return (
    <li>
      <article className={styles.card}>
        {show.image ? (
          <img
            className={`${styles.poster} ${styles.posterImage}`}
            src={show.image.medium}
            alt={`Постер: ${show.name}`}
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
              <a href={show.url} target="_blank" rel="noreferrer">
                {show.name}
              </a>
            </h2>
            {show.rating.average !== null && (
              <span className={styles.rating}>★ {show.rating.average}</span>
            )}
          </div>

          {meta.length > 0 && <p className={styles.meta}>{meta.join(" · ")}</p>}

          {show.genres.length > 0 && (
            <ul className={styles.genres} aria-label="Жанры">
              {show.genres.map((genre) => (
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
