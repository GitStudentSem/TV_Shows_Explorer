import { observer } from "mobx-react-lite";
import { ControlPanel } from "./ControlPanel/ControlPanel";
import { FavoritesScreen } from "./FavoritesScreen/FavoritesScreen";
import { Footer } from "./Footer/Footer";
import { Header } from "./Header/Header";
import { usePresenter } from "./logic/usePresenter";
import styles from "./Screens.module.css";
import { SearchScreen } from "./SearchScreen/SearchScreen";
import { TvScreen } from "./TvScreen/TvScreen";

/**
 * Корпус телевизора и переключение каналов: поиск или избранное. Корпус и
 * кинескоп одни на все каналы, меняется только то, что внутри них: так
 * бегущая строка на экране переживает переключение канала.
 */
export const Screens = observer(function Screens() {
  const { isWarmingUp, isFavoritesOpen, toggleFavorites } = usePresenter();

  return (
    <main className={styles.tv}>
      <Header />
      <ControlPanel isFavoritesOpen={isFavoritesOpen} />
      <TvScreen>
        {isFavoritesOpen ? (
          <FavoritesScreen />
        ) : (
          <SearchScreen isWarmingUp={isWarmingUp} />
        )}
      </TvScreen>
      <Footer
        isFavoritesOpen={isFavoritesOpen}
        onToggleFavorites={toggleFavorites}
      />
    </main>
  );
});
