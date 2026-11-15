import styles from "./Beam.module.css";

/** Луч кинескопа: точка, горизонтальная полоса, вспышка на весь экран. */
export function Beam() {
  return <div className={styles.beam} aria-hidden="true" />;
}
