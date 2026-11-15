import { usePresenter } from "./logic/usePresenter";
import styles from "./PageSwitch.module.css";

export interface PageSwitchProps {
  /** Подпись для навигации: чьи это страницы. */
  label: string;
  /** Текущая страница; `null` — листать нечего, табло гаснет. */
  page: number | null;
  pageCount: number;
  onPrev: () => void;
  onNext: () => void;
}

/**
 * Переключатель страниц на корпусе: две кнопки и механическое табло между ними.
 * Он есть всегда, а кнопки гаснут, когда листать некуда: высота не скачет.
 */
export function PageSwitch(props: PageSwitchProps) {
  const {
    label,
    current,
    total,
    displayLabel,
    isPrevDisabled,
    isNextDisabled,
    onPrev,
    onNext,
  } = usePresenter(props);

  return (
    <nav className={styles.switch} aria-label={label}>
      <button
        type="button"
        className={styles.step}
        disabled={isPrevDisabled}
        aria-label="Предыдущая страница"
        onClick={onPrev}
      >
        ◀
      </button>

      <output className={styles.display} aria-label={displayLabel}>
        <span className={styles.flap}>{current}</span>
        <span className={styles.total}>/{total}</span>
      </output>

      <button
        type="button"
        className={styles.step}
        disabled={isNextDisabled}
        aria-label="Следующая страница"
        onClick={onNext}
      >
        ▶
      </button>
    </nav>
  );
}
