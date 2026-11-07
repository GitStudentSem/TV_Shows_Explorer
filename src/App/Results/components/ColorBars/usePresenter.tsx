import type { ComponentProps } from "react"
import styles from './ColorBars.module.css'

interface UsePresenterProps extends ComponentProps<'div'> {
  className?: string
}
export function usePresenter({ className}:UsePresenterProps) {
    const classNames = className ? `${styles.colorBars} ${className}` : styles.colorBars
  return {
   classNames,
  }
}
