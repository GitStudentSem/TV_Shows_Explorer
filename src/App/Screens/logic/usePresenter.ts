import { userStore } from "../../../stores/UserStore";
import { useChannel } from "./useChannels";
import { useSessionRestore } from "./useSessionRestore";
import { useWarmUp } from "./useWarmUp";

export function usePresenter() {
  useSessionRestore();
  const isWarmingUp = useWarmUp();
  const { channel, toggleFavorites } = useChannel();
  const isFavoritesOpen = channel === "favorites";
  const isCheckingSession = userStore.status === "checking";

  return {
    isWarmingUp,
    isSearchOpen: channel === "search",
    isFavoritesOpen,
    isFavoritesLoading: isFavoritesOpen && isCheckingSession,
    isFavoritesVisible: isFavoritesOpen && !isCheckingSession,
    isLoginOpen: channel === "login",
    toggleFavorites,
  };
}
