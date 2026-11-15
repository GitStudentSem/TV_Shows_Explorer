import { observer } from "mobx-react-lite";
import { usePresenter } from "./logic/usePresenter";
import styles from "./Toast.module.css";

/** Уведомление в виде бегущей строки «срочных новостей». */
export const Toast = observer(function Toast() {
  const { isVisible, key, label, text, isError, close } = usePresenter();

  return (
    <div className={styles.region} role="status" aria-live="polite">
      {isVisible && (
        <div className={styles.ticker} data-error={isError}>
          <span className={styles.label}>{label}</span>
          <p className={styles.track}>
            <span key={key} className={styles.text}>
              {text}
            </span>
          </p>
          <button
            type="button"
            className={styles.close}
            aria-label="Закрыть уведомление"
            onClick={close}
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
});
