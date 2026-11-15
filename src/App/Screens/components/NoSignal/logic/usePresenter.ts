import type { NoSignalProps } from "../NoSignal";
import { getErrorText } from "./getErrorText";

export function usePresenter({ error, onRetry }: NoSignalProps) {
  return {
    errorText: getErrorText(error),
    onRetry,
  };
}
