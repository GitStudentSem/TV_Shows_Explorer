import { ShowSlots } from "../ShowSlots/ShowSlots";
import styles from "./Loading.module.css";

/** Сигнал ещё не пришёл: все слоты экрана в ряби. */
export function Loading() {
  return (
    <div className={styles.loading} role="status" aria-label="Загрузка">
      <p className={styles.note} aria-hidden="true">
        Ловим сигнал…
      </p>
      <ShowSlots shows={[]} />
    </div>
  );
}
