import { observer } from 'mobx-react-lite'
import { showsStore } from '../../stores/ShowsStore'
import styles from './GenreChips.module.css'

export const GenreChips = observer(function GenreChips() {
  const { genres, selectedGenre, shows } = showsStore

  if (genres.length === 0) return null

  return (
    <div className={styles.chips} role="group" aria-label="Фильтр по жанрам">
      <button
        type="button"
        className={styles.chip}
        aria-pressed={selectedGenre === null}
        onClick={() => showsStore.selectGenre(null)}
      >
        Все <span className={styles.chipCount}>{shows.length}</span>
      </button>
      {genres.map(({ name, count }) => (
        <button
          key={name}
          type="button"
          className={styles.chip}
          aria-pressed={selectedGenre === name}
          onClick={() => showsStore.selectGenre(name)}
        >
          {name} <span className={styles.chipCount}>{count}</span>
        </button>
      ))}
    </div>
  )
})
