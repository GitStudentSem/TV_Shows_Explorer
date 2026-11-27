import { observer } from "mobx-react-lite";
import { Glyph } from "../../components/Glyph/Glyph";
import { TvButton } from "../../components/TvButton/TvButton";
import styles from "./FavoritesButton.module.css";
import { usePresenter } from "./logic/usePresenter";

export interface FavoritesButtonProps {
  isOpen: boolean;
  onToggle: () => void;
}

export const FavoritesButton = observer(function FavoritesButton(
  props: FavoritesButtonProps,
) {
  const { icon, label, hasCount, countText, isPressed, handleClick } =
    usePresenter(props);

  return (
    <TvButton aria-pressed={isPressed} onClick={handleClick}>
      <Glyph>{icon}</Glyph>
      {label}
      {hasCount && <span className={styles.count}>{countText}</span>}
    </TvButton>
  );
});
