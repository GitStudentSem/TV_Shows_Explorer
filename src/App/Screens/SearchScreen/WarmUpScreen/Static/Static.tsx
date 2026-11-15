import styles from "./Static.module.css";

/** Едва заметная рябь, пока трубка прогревается. */
export function Static() {
  return <div className={styles.static} aria-hidden="true" />;
}
