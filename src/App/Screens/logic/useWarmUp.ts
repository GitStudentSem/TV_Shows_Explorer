import { useEffect, useState } from "react";
import { wakeUpServer } from "./tasks/wakeUpServer";

/** Столько длится включение кинескопа (луч и вспышка в WarmUpScreen). */
const SWITCH_ON_MS = 1400;

/**
 * Телевизор включается при старте: кинескоп показываем, пока не закончится
 * анимация включения и пока не ответит сервер. Ошибку здесь не показываем:
 * если сервер недоступен, об этом скажет сам поиск.
 */
export function useWarmUp(): boolean {
  const [isServerAwake, setIsServerAwake] = useState(false);
  const [isSwitchedOn, setIsSwitchedOn] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const timer = setTimeout(() => setIsSwitchedOn(true), SWITCH_ON_MS);

    wakeUpServer(controller.signal).then(() => {
      if (!controller.signal.aborted) setIsServerAwake(true);
    });

    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, []);

  return !isServerAwake || !isSwitchedOn;
}
