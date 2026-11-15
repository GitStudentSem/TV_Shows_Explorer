import { observer } from "mobx-react-lite";
import styles from "./App.module.css";
import { FavoritesButton } from "./FavoritesButton/FavoritesButton";
import { FavoritesPanel } from "./FavoritesPanel/FavoritesPanel";
import { usePresenter } from "./logic/usePresenter";
import { Pagination } from "./Pagination/Pagination";
import { Results } from "./Results/Results";
import { SearchBar } from "./SearchBar/SearchBar";
import { Toast } from "./Toast/Toast";

const App = observer(function App() {
  const { isFavoritesOpen, toggleFavorites } = usePresenter();

  return (
    <main className={styles.tv}>
      <header className={styles.header}>
        <div className={styles.headerRow}>
          <h1 className={styles.logo}>TV Shows Explorer</h1>
          <FavoritesButton
            isOpen={isFavoritesOpen}
            onToggle={toggleFavorites}
          />
        </div>
        <div className={styles.stripes} aria-hidden="true" />
      </header>

      <div className={styles.screen}>
        {isFavoritesOpen ? (
          <FavoritesPanel />
        ) : (
          <>
            <SearchBar />
            <Results />
          </>
        )}
      </div>

      {!isFavoritesOpen && <Pagination />}
      <Toast />
    </main>
  );
});

export default App;
