import { FavoritesButton } from "./FavoritesButton/FavoritesButton";
import styles from "./Header.module.css";

export interface HeaderProps {
  isFavoritesOpen: boolean;
  onToggleFavorites: () => void;
}

/** Верх корпуса: название и переключатель канала «Избранное». */
export function Header({ isFavoritesOpen, onToggleFavorites }: HeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.headerRow}>
        <h1 className={styles.logo}>TV Shows Explorer</h1>
        <FavoritesButton
          isOpen={isFavoritesOpen}
          onToggle={onToggleFavorites}
        />
      </div>
      <div className={styles.stripes} aria-hidden="true" />
    </header>
  );
}
