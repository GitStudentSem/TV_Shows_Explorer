import type { PageSwitchProps } from "../PageSwitch";

/** Так выглядит погасшее табло, когда листать нечего. */
const BLANK = "--";

export function usePresenter({
  label,
  page,
  pageCount,
  onPrev,
  onNext,
}: PageSwitchProps) {
  const isOn = page !== null;

  return {
    label,
    current: isOn ? toDigits(page) : BLANK,
    total: isOn ? toDigits(pageCount) : BLANK,
    displayLabel: isOn ? `Страница ${page} из ${pageCount}` : "Страниц нет",
    isPrevDisabled: !isOn || page <= 1,
    isNextDisabled: !isOn || page >= pageCount,
    onPrev,
    onNext,
  };
}

function toDigits(value: number): string {
  return String(value).padStart(2, "0");
}
