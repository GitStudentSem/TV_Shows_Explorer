import { Glyph } from "../components/Glyph/Glyph";
import styles from "./ControlPanel.module.css";
import { GenreSelect } from "./GenreSelect/GenreSelect";
import { SearchBar } from "./SearchBar/SearchBar";

export interface ControlPanelProps {
  isFavoritesOpen: boolean;
}

/**
 * Панель управления на корпусе над кинескопом: поиск и жанр или табличка
 * канала «Избранное». Высота одна на всех каналах: экран не двигается.
 */
export function ControlPanel({ isFavoritesOpen }: ControlPanelProps) {
  return (
    <div className={styles.panel}>
      {isFavoritesOpen ? (
        <h2 id="favorites-title" className={styles.title}>
          <Glyph>✦</Glyph> Избранное
        </h2>
      ) : (
        <>
          <SearchBar />
          <GenreSelect />
        </>
      )}
    </div>
  );
}
