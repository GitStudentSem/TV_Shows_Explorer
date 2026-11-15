import { FavoritesButton } from "./FavoritesButton/FavoritesButton";
import { FavoritesPagination } from "./FavoritesPagination/FavoritesPagination";
import styles from "./Footer.module.css";
import { SearchPagination } from "./SearchPagination/SearchPagination";

export interface FooterProps {
  isFavoritesOpen: boolean;
  onToggleFavorites: () => void;
}

/**
 * Низ корпуса: ручки управления. Они на месте на любом канале и в любом
 * состоянии, поэтому высота телевизора не меняется.
 */
export function Footer({ isFavoritesOpen, onToggleFavorites }: FooterProps) {
  return (
    <footer className={styles.footer}>
      {isFavoritesOpen ? <FavoritesPagination /> : <SearchPagination />}
      <FavoritesButton isOpen={isFavoritesOpen} onToggle={onToggleFavorites} />
    </footer>
  );
}
