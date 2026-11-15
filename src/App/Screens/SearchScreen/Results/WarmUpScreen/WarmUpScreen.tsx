import { Beam } from "./Beam/Beam";
import { Static } from "./Static/Static";
import styles from "./WarmUpScreen.module.css";

/** Кинескоп включается: так выглядит ожидание, пока сервер просыпается. */
export function WarmUpScreen() {
  return (
    <div className={styles.screen} role="status">
      <Beam />
      <Static />
      <div className={styles.content}>
        <p className={styles.title}>Кинескоп прогревается…</p>
        <p className={styles.text}>
          Сервер просыпается после простоя. Первый запуск занимает до минуты,
          дальше всё работает быстро.
        </p>
      </div>
    </div>
  );
}
