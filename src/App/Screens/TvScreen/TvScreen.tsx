import type { ReactNode } from "react";
import { Toast } from "./Toast/Toast";
import styles from "./TvScreen.module.css";

/**
 * Кинескоп: рамка экрана со строками развёртки. Внутри — содержимое канала
 * и бегущая строка уведомлений поверх него, как на новостном канале.
 */
export function TvScreen({ children }: { children: ReactNode }) {
  return (
    <div className={styles.screen}>
      {children}
      <Toast />
    </div>
  );
}
