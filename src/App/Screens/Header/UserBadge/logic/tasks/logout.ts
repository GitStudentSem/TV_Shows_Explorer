import { postLogout } from "../../../../../../api/auth";
import { endSession } from "../../../../../../tasks/endSession";

/** Сразу завершаем локальную сессию, затем уведомляем сервер. */
export async function logout(): Promise<void> {
  endSession();
  try {
    await postLogout();
  } catch {
    // При сбое сети пользователь остаётся гостем.
  }
}
