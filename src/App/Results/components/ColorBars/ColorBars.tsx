import type { ComponentProps } from 'react'
import styles from './ColorBars.module.css'

/** Настроечная таблица: заглушка для отсутствующего постера и потерянного сигнала. */
export function ColorBars({ className, ...props }: ComponentProps<'div'>) {
  const classNames = className ? `${styles.colorBars} ${className}` : styles.colorBars

  return <div className={classNames} {...props} />
}
