import type { ApiErrorCode } from "../../../../api/client";
import { ColorBars } from "../ColorBars/ColorBars";
import { MessagePanel } from "../MessagePanel/MessagePanel";
import { usePresenter } from "./logic/usePresenter";
import styles from "./NoSignal.module.css";

export interface NoSignalProps {
  error: ApiErrorCode | null;
  onRetry: () => void;
}

/**
 * Профилактика: канал не работает. Любая ошибка загрузки на экране выглядит
 * одинаково — настроечная таблица, текст по коду ошибки и «Повторить».
 */
export function NoSignal(props: NoSignalProps) {
  const { errorText, onRetry } = usePresenter(props);

  return (
    <ColorBars className={styles.message} role="alert">
      <MessagePanel title="Нет сигнала">
        <p>{errorText}</p>
        <button type="button" className={styles.button} onClick={onRetry}>
          Повторить
        </button>
      </MessagePanel>
    </ColorBars>
  );
}
