import { useChannel } from "./useChannels";
import { useSessionRestore } from "./useSessionRestore";
import { useWarmUp } from "./useWarmUp";

export function usePresenter() {
  useSessionRestore();
  const isWarmingUp = useWarmUp();
  const { channel, toggleFavorites } = useChannel();

  return {
    isWarmingUp,
    isSearchOpen: channel === "search",
    isFavoritesOpen: channel === "favorites",
    isLoginOpen: channel === "login",
    toggleFavorites,
  };
}
