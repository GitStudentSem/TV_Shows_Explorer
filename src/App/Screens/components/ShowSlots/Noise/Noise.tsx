import styles from "./Noise.module.css";

/** Пустой слот: белый шум, как на канале без сигнала. */
export function Noise() {
  return <li className={styles.noise} aria-hidden="true" />;
}
