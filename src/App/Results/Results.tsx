import { observer } from 'mobx-react-lite'
import { PAGE_SIZE, showsStore } from '../../stores/ShowsStore'
import { ColorBars } from '../ColorBars/ColorBars'
import { GenreChips } from '../GenreChips/GenreChips'
import { ShowCard } from '../ShowCard/ShowCard'
import styles from './Results.module.css'

export const Results = observer(function Results() {
  const { status, shows, filteredShows, visibleShows, errorMessage, query } = showsStore

  if (status === 'idle') return null

  if (status === 'loading') {
    return (
      <div className={styles.skeletons} role="status" aria-label="Загрузка результатов">
        {Array.from({ length: PAGE_SIZE }, (_, index) => (
          <div key={index} className={styles.skeleton} />
        ))}
      </div>
    )
  }

  if (status === 'error') {
    return (
      <ColorBars className={styles.message} role="alert">
        <div className={styles.messagePanel}>
          <h2 className={styles.messageTitle}>Нет сигнала</h2>
          <p>{errorMessage}</p>
          <button type="button" className={styles.button} onClick={showsStore.submit}>
            Повторить
          </button>
        </div>
      </ColorBars>
    )
  }

  if (shows.length === 0) {
    return (
      <div className={styles.message} role="status">
        <div className={styles.messagePanel}>
          <h2 className={styles.messageTitle}>Ничего не найдено</h2>
          <p>По запросу «{query.trim()}» на этом канале пусто. Попробуйте другое название.</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <GenreChips />
      <p className={styles.count} role="status">
        Найдено: {filteredShows.length}
      </p>
      <ul className={styles.list}>
        {visibleShows.map((show) => (
          <ShowCard key={show.id} show={show} />
        ))}
      </ul>
    </>
  )
})
