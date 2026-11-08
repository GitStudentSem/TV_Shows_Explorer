import { observer } from "mobx-react-lite";
import styles from "./GenreChips.module.css";
import { usePresenter } from "./usePresenter";

export const GenreChips = observer(function GenreChips() {
  const { genres, isVisible, totalCount, isAllSelected, selectAll } =
    usePresenter();

  if (!isVisible) return null;

  return (
    <fieldset className={styles.chips} aria-label="Фильтр по жанрам">
      <button
        type="button"
        className={styles.chip}
        aria-pressed={isAllSelected}
        onClick={selectAll}
      >
        Все <span className={styles.chipCount}>{totalCount}</span>
      </button>
      {genres.map(({ name, count, isSelected, onSelect }) => (
        <button
          key={name}
          type="button"
          className={styles.chip}
          aria-pressed={isSelected}
          onClick={onSelect}
        >
          {name} <span className={styles.chipCount}>{count}</span>
        </button>
      ))}
    </fieldset>
  );
});
