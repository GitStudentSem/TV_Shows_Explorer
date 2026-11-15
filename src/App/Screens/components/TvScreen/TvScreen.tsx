import type { ReactNode } from "react";
import styles from "./TvScreen.module.css";

/** Кинескоп: рамка экрана со строками развёртки. Внутри — содержимое канала. */
export function TvScreen({ children }: { children: ReactNode }) {
  return <div className={styles.screen}>{children}</div>;
}
