import type { ComponentProps } from 'react'
import { usePresenter } from './usePresenter'

/** Настроечная таблица: заглушка для отсутствующего постера и потерянного сигнала. */
export function ColorBars({ className, ...props }: ComponentProps<'div'>) {
  const {classNames} = usePresenter({ className })

  return <div className={classNames} {...props} />
}
