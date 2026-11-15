import { observer } from "mobx-react-lite";
import styles from "./GenreSelect.module.css";
import { usePresenter } from "./logic/usePresenter";

export const GenreSelect = observer(function GenreSelect() {
  const { value, isDisabled, options, handleChange } = usePresenter();

  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor="genre-select">
        Жанр
      </label>
      <select
        id="genre-select"
        className={styles.select}
        value={value}
        disabled={isDisabled}
        onChange={handleChange}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
});
