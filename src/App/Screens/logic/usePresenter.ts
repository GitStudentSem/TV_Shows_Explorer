import { useChannel } from "./useChannels";
import { useFavoritesLoader } from "./useFavoritesLoader";
import { useWarmUp } from "./useWarmUp";

export function usePresenter() {
  useFavoritesLoader();
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
