import type { ComponentProps } from "react";
import { usePresenter } from "./logic/usePresenter";

export interface ColorBarsProps extends ComponentProps<"div"> {}

/** Настроечная таблица: заглушка для отсутствующего постера, экрана профилактики. */
export function ColorBars({ className, ...props }: ColorBarsProps) {
  const { classNames } = usePresenter({ className });

  return <div className={classNames} {...props} />;
}
