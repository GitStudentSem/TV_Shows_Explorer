import { ApiError, type ApiErrorCode } from "../../../api/client";
import { fetchHealth } from "../../../api/health";

export interface WakeUpServerResult {
  error: ApiErrorCode | null;
}

/**
 * Разбудить сервер и дождаться, пока он ответит. После простоя хостинг
 * поднимает его заново, и первый ответ может идти до минуты.
 */
export async function wakeUpServer(
  signal: AbortSignal,
): Promise<WakeUpServerResult> {
  try {
    await fetchHealth(signal);
    return { error: null };
  } catch (error) {
    if (signal.aborted) return { error: null };
    return { error: error instanceof ApiError ? error.code : "network" };
  }
}
