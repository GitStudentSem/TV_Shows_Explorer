import { type ApiErrorCode, toApiErrorCode } from "../../../../api/client";
import { fetchHealth } from "../../../../api/health";

export interface WakeUpServerResult {
  error: ApiErrorCode | null;
}

/**
 * Разбудить сервер и дождаться, пока он ответит. После простоя хостинг
 * поднимает его заново, и первый ответ может идти до минуты.
 */
export async function wakeUpServer(): Promise<WakeUpServerResult> {
  try {
    await fetchHealth();
    return { error: null };
  } catch (error) {
    return { error: toApiErrorCode(error) };
  }
}
