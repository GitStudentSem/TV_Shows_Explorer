import { showsStore } from "../../../stores/ShowsStore";

export function usePresenter() {
  return {
    errorMessage: showsStore.errorMessage,
    retry: () => showsStore.submit(),
  };
}
