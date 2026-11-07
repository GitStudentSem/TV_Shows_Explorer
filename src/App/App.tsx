import { Pagination } from '../components/Pagination/Pagination'
import { Results } from '../components/Results/Results'
import { SearchBar } from '../components/SearchBar/SearchBar'
import styles from './App.module.css'

function App() {
  return (
    <main className={styles.tv}>
      <header className={styles.header}>
        <h1 className={styles.logo}>TV Shows Explorer</h1>
        <div className={styles.stripes} aria-hidden="true" />
      </header>

      <div className={styles.screen}>
        <SearchBar />
        <Results />
      </div>

      <Pagination />
    </main>
  )
}

export default App
