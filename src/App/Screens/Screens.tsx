import { observer } from "mobx-react-lite";
import { FavoritesScreen } from "./FavoritesScreen/FavoritesScreen";
import { Header } from "./Header/Header";
import { usePresenter } from "./logic/usePresenter";
import styles from "./Screens.module.css";
import { SearchScreen } from "./SearchScreen/SearchScreen";

/** Корпус телевизора и переключение каналов: поиск или избранное. */
export const Screens = observer(function Screens() {
  const { isWarmingUp, isFavoritesOpen, toggleFavorites } = usePresenter();

  return (
    <main className={styles.tv}>
      <Header
        isFavoritesOpen={isFavoritesOpen}
        onToggleFavorites={toggleFavorites}
      />
      {isFavoritesOpen ? (
        <FavoritesScreen />
      ) : (
        <SearchScreen isWarmingUp={isWarmingUp} />
      )}
    </main>
  );
});
