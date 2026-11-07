import styles from './ColorBars.module.css'
import type { ColorBarsProps } from "./ColorBars"

export function usePresenter({ className}:ColorBarsProps) {
    const classNames = className ? `${styles.colorBars} ${className}` : styles.colorBars
  return {
   classNames,
  }
}
