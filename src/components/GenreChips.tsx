import { observer } from 'mobx-react-lite'
import { showsStore } from '../stores/ShowsStore'

export const GenreChips = observer(function GenreChips() {
  const { genres, selectedGenre, shows } = showsStore

  if (genres.length === 0) return null

  return (
    <div className="chips" role="group" aria-label="Фильтр по жанрам">
      <button
        type="button"
        className="chip"
        aria-pressed={selectedGenre === null}
        onClick={() => showsStore.selectGenre(null)}
      >
        Все <span className="chip__count">{shows.length}</span>
      </button>
      {genres.map(({ name, count }) => (
        <button
          key={name}
          type="button"
          className="chip"
          aria-pressed={selectedGenre === name}
          onClick={() => showsStore.selectGenre(name)}
        >
          {name} <span className="chip__count">{count}</span>
        </button>
      ))}
    </div>
  )
})
