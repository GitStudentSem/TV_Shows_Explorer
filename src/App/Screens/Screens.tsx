import { observer } from "mobx-react-lite";
import { ControlPanel } from "./ControlPanel/ControlPanel";
import { Loading } from "./components/Loading/Loading";
import { FavoritesScreen } from "./FavoritesScreen/FavoritesScreen";
import { Footer } from "./Footer/Footer";
import { Header } from "./Header/Header";
import { LoginScreen } from "./LoginScreen/LoginScreen";
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
  const {
    isWarmingUp,
    isSearchOpen,
    isFavoritesOpen,
    isFavoritesLoading,
    isFavoritesVisible,
    isLoginOpen,
    toggleFavorites,
  } = usePresenter();

  return (
    <main className={styles.tv}>
      <Header />
      <ControlPanel
        isFavoritesOpen={isFavoritesOpen}
        isLoginOpen={isLoginOpen}
        isSearchOpen={isSearchOpen}
      />
      <TvScreen>
        {isSearchOpen && <SearchScreen isWarmingUp={isWarmingUp} />}
        {isFavoritesLoading && <Loading />}
        {isFavoritesVisible && <FavoritesScreen />}
        {isLoginOpen && <LoginScreen />}
      </TvScreen>
      <Footer
        isSearchOpen={isSearchOpen}
        isFavoritesOpen={isFavoritesOpen}
        onToggleFavorites={toggleFavorites}
      />
    </main>
  );
});
