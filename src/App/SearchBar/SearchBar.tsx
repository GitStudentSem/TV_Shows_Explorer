import { observer } from 'mobx-react-lite'
import styles from './SearchBar.module.css'
import { usePresenter } from './usePresenter'

export const SearchBar = observer(function SearchBar() {

const { query, handleChange, handleSubmit } = usePresenter()
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
        value={query}
        onChange={handleChange}
      />
    </form>
  )
})
