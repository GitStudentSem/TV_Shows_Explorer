import { observer } from "mobx-react-lite";
import styles from "./App.module.css";
import { usePresenter } from "./logic/usePresenter";
import { Pagination } from "./Pagination/Pagination";
import { Results } from "./Results/Results";
import { SearchBar } from "./SearchBar/SearchBar";

const App = observer(function App() {
  usePresenter();

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
  );
});

export default App;
