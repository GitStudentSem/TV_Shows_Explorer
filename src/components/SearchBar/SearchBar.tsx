import { observer } from 'mobx-react-lite'
import type { FormEvent } from 'react'
import { showsStore } from '../../stores/ShowsStore'
import styles from './SearchBar.module.css'

export const SearchBar = observer(function SearchBar() {
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    showsStore.submit()
  }

  return (
    <form className={styles.search} role="search" onSubmit={handleSubmit}>
      <label className={styles.label} htmlFor="show-search">
        Поиск сериала
      </label>
      <input
        id="show-search"
        className={styles.input}
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
