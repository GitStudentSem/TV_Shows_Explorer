import type { Show } from '../api/tvmaze'

interface ShowCardProps {
  show: Show
}

/** API отдаёт описание как HTML. DOMParser не выполняет скрипты, а в разметку идёт только текст. */
function getPlainText(html: string | null): string {
  if (!html) return ''
  return new DOMParser().parseFromString(html, 'text/html').body.textContent?.trim() ?? ''
}

function getYears({ premiered, ended, status }: Show): string | null {
  if (!premiered) return null
  const start = premiered.slice(0, 4)
  if (ended) return ended.slice(0, 4) === start ? start : `${start}–${ended.slice(0, 4)}`
  return status === 'Running' ? `${start}–…` : start
}

export function ShowCard({ show }: ShowCardProps) {
  const summary = getPlainText(show.summary)
  const channel = show.network?.name ?? show.webChannel?.name
  const meta = [getYears(show), channel, show.language].filter(Boolean)

  return (
    <li>
      <article className="card">
        {show.image ? (
          <img
            className="card__poster"
            src={show.image.medium}
            alt={`Постер: ${show.name}`}
            width={210}
            height={295}
            loading="lazy"
          />
        ) : (
          <div className="card__poster color-bars" role="img" aria-label="Постера нет">
            <span className="color-bars__label">Нет постера</span>
          </div>
        )}

        <div className="card__body">
          <div className="card__heading">
            <h2 className="card__title">
              <a href={show.url} target="_blank" rel="noreferrer">
                {show.name}
              </a>
            </h2>
            {show.rating.average !== null && (
              <span className="card__rating" aria-label={`Рейтинг ${show.rating.average} из 10`}>
                ★ {show.rating.average}
              </span>
            )}
          </div>

          {meta.length > 0 && <p className="card__meta">{meta.join(' · ')}</p>}

          {show.genres.length > 0 && (
            <ul className="card__genres" aria-label="Жанры">
              {show.genres.map((genre) => (
                <li key={genre}>{genre}</li>
              ))}
            </ul>
          )}

          {summary && <p className="card__summary">{summary}</p>}
        </div>
      </article>
    </li>
  )
}
