import { observer } from 'mobx-react-lite'
import type { FormEvent } from 'react'
import { showsStore } from '../stores/ShowsStore'

export const SearchBar = observer(function SearchBar() {
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    showsStore.submit()
  }

  return (
    <form className="search" role="search" onSubmit={handleSubmit}>
      <label className="search__label" htmlFor="show-search">
        Поиск сериала
      </label>
      <input
        id="show-search"
        className="search__input"
        type="search"
        placeholder="Что сегодня смотрим?"
        autoComplete="off"
        autoFocus
        value={showsStore.query}
        onChange={(event) => showsStore.setQuery(event.target.value)}
      />
    </form>
  )
})
