import type { ReactNode } from "react";
import styles from "./MessagePanel.module.css";

export interface MessagePanelProps {
  title: string;
  children: ReactNode;
}

/** Панель с заголовком для сообщений о состоянии выдачи. */
export function MessagePanel({ title, children }: MessagePanelProps) {
  return (
    <div className={styles.panel}>
      <h2 className={styles.title}>{title}</h2>
      {children}
    </div>
  );
}
