import { useEffect } from "react";
import { restoreSession } from "./tasks/restoreSession";

/** Звёздочки и счётчик нужны сразу, поэтому id избранного грузим при старте приложения. */
export function useSessionRestore() {
  useEffect(() => {
    restoreSession();
  }, []);
}
