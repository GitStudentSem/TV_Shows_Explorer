import { useEffect, useState } from "react";

/**
 * Становится true, если компонент провисел на экране дольше `delayMs`.
 * Таймер — реакция интерфейса на ожидание, поэтому он в Presenter (8.2).
 */
export function useIsSlow(delayMs: number): boolean {
  const [isSlow, setIsSlow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsSlow(true), delayMs);
    return () => clearTimeout(timer);
  }, [delayMs]);

  return isSlow;
}
