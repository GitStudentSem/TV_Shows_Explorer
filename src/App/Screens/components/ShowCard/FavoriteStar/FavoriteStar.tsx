import { observer } from "mobx-react-lite";
import type { Show } from "../../../../../api/shows";
import { Glyph } from "../../Glyph/Glyph";
import styles from "./FavoriteStar.module.css";
import { usePresenter } from "./logic/usePresenter";

export interface FavoriteStarProps {
  show: Show;
}

export const FavoriteStar = observer(function FavoriteStar({
  show,
}: FavoriteStarProps) {
  const { icon, isPressed, isDisabled, label, handleClick } =
    usePresenter(show);

  return (
    <button
      type="button"
      className={styles.star}
      aria-pressed={isPressed}
      aria-label={label}
      title={label}
      disabled={isDisabled}
      onClick={handleClick}
    >
      <Glyph>{icon}</Glyph>
    </button>
  );
});
