import type { ColorBarsProps } from "./ColorBars";
import styles from "./ColorBars.module.css";

export function usePresenter({ className }: ColorBarsProps) {
  const classNames = className
    ? `${styles.colorBars} ${className}`
    : styles.colorBars;
  return {
    classNames,
  };
}
