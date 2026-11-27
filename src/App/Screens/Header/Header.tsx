import styles from "./Header.module.css";
import { UserBadge } from "./UserBadge/UserBadge";

/** Верх корпуса: название и полосы. */
export function Header() {
  return (
    <header className={styles.header}>
      <h1 className={styles.logo}>TV Shows Explorer</h1>
      <UserBadge />
      <div className={styles.stripes} aria-hidden="true" />
    </header>
  );
}
