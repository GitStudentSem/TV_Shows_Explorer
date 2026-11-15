import type { ReactNode } from "react";
import { ColorBars } from "../ColorBars/ColorBars";
import styles from "./OffAir.module.css";

export interface OffAirProps {
  title: string;
  /** `alert` — для сбоя, о котором надо сообщить сразу, `status` — для остального. */
  role: "alert" | "status";
  children: ReactNode;
}

/**
 * Профилактика: на канале нечего показать. Ошибка, пустая выдача или пустое
 * избранное выглядят одинаково — настроечная таблица и панель с текстом.
 */
export function OffAir({ title, role, children }: OffAirProps) {
  return (
    <ColorBars className={styles.screen} role={role}>
      <div className={styles.panel}>
        <h2 className={styles.title}>{title}</h2>
        {children}
      </div>
    </ColorBars>
  );
}
