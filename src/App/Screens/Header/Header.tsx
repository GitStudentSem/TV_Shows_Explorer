import styles from "./Header.module.css";

/** Верх корпуса: название и полосы. */
export function Header() {
  return (
    <header className={styles.header}>
      <h1 className={styles.logo}>TV Shows Explorer</h1>
      <div className={styles.stripes} aria-hidden="true" />
    </header>
  );
}
