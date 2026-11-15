import type { ApiErrorCode } from "../../../../api/client";
import { OffAir } from "../OffAir/OffAir";
import { usePresenter } from "./logic/usePresenter";
import styles from "./NoSignal.module.css";

export interface NoSignalProps {
  error: ApiErrorCode | null;
  onRetry: () => void;
}

/**
 * Канал не работает. Любая ошибка загрузки на экране выглядит одинаково —
 * профилактика, текст по коду ошибки и «Повторить».
 */
export function NoSignal(props: NoSignalProps) {
  const { errorText, onRetry } = usePresenter(props);

  return (
    <OffAir title="Нет сигнала" role="alert">
      <p>{errorText}</p>
      <button type="button" className={styles.button} onClick={onRetry}>
        Повторить
      </button>
    </OffAir>
  );
}
