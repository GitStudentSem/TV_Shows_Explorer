import { Glyph } from "../components/Glyph/Glyph";
import styles from "./ControlPanel.module.css";
import { GenreSelect } from "./GenreSelect/GenreSelect";
import { SearchBar } from "./SearchBar/SearchBar";

export interface ControlPanelProps {
  isSearchOpen: boolean;
  isFavoritesOpen: boolean;
  isLoginOpen: boolean;
}

/**
 * Панель управления на корпусе над кинескопом: поиск и жанр или табличка
 * канала («Избранное», «Вход»). Высота одна на всех каналах: экран не двигается.
 */
export function ControlPanel({
  isSearchOpen,
  isFavoritesOpen,
  isLoginOpen,
}: ControlPanelProps) {
  return (
    <div className={styles.panel}>
      {isSearchOpen && (
        <>
          <SearchBar />
          <GenreSelect />
        </>
      )}
      {isFavoritesOpen && (
        <h2 id="favorites-title" className={styles.title}>
          <Glyph>✦</Glyph> Избранное
        </h2>
      )}
      {isLoginOpen && (
        <h2 id="login-title" className={styles.title}>
          <Glyph>⏻</Glyph> Вход
        </h2>
      )}
    </div>
  );
}
