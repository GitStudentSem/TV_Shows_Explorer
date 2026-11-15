import { observer } from "mobx-react-lite";
import styles from "./FavoritesButton.module.css";
import { usePresenter } from "./logic/usePresenter";

export interface FavoritesButtonProps {
  isOpen: boolean;
  onToggle: () => void;
}

export const FavoritesButton = observer(function FavoritesButton(
  props: FavoritesButtonProps,
) {
  const { label, hasCount, countText, isPressed, handleClick } =
    usePresenter(props);

  return (
    <button
      type="button"
      className={styles.button}
      aria-pressed={isPressed}
      onClick={handleClick}
    >
      {label}
      {hasCount && <span className={styles.count}>{countText}</span>}
    </button>
  );
});
