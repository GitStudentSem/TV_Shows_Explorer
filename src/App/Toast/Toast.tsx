import { observer } from "mobx-react-lite";
import { usePresenter } from "./logic/usePresenter";
import styles from "./Toast.module.css";

export const Toast = observer(function Toast() {
  const { isVisible, text, isError, close } = usePresenter();

  return (
    <div className={styles.region} role="status" aria-live="polite">
      {isVisible && (
        <div className={styles.toast} data-error={isError}>
          <span>{text}</span>
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
