import { observer } from 'mobx-react-lite'
import { PAGE_SIZE, showsStore } from '../stores/ShowsStore'
import { GenreChips } from './GenreChips'
import { ShowCard } from './ShowCard'

export const Results = observer(function Results() {
  const { status, shows, filteredShows, visibleShows, errorMessage, query } = showsStore

  if (status === 'idle') return null

  if (status === 'loading') {
    return (
      <div className="skeletons" role="status" aria-label="Загрузка результатов">
        {Array.from({ length: PAGE_SIZE }, (_, index) => (
          <div key={index} className="skeleton" />
        ))}
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="message color-bars" role="alert">
        <div className="message__panel">
          <h2 className="message__title">Нет сигнала</h2>
          <p>{errorMessage}</p>
          <button type="button" className="button" onClick={showsStore.submit}>
            Повторить
          </button>
        </div>
      </div>
    )
  }

  if (shows.length === 0) {
    return (
      <div className="message" role="status">
        <div className="message__panel">
          <h2 className="message__title">Ничего не найдено</h2>
          <p>По запросу «{query.trim()}» на этом канале пусто. Попробуйте другое название.</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <GenreChips />
      <p className="results__count" role="status">
        Найдено: {filteredShows.length}
      </p>
      <ul className="results__list">
        {visibleShows.map((show) => (
          <ShowCard key={show.id} show={show} />
        ))}
      </ul>
    </>
  )
})
