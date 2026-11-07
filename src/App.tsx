import { Pagination } from './components/Pagination'
import { Results } from './components/Results'
import { SearchBar } from './components/SearchBar'

function App() {
  return (
    <main className="tv">
      <header className="tv__header">
        <h1 className="tv__logo">TV Shows Explorer</h1>
        <div className="tv__stripes" aria-hidden="true" />
      </header>

      <div className="tv__screen">
        <SearchBar />
        <Results />
      </div>

      <Pagination />
    </main>
  )
}

export default App
