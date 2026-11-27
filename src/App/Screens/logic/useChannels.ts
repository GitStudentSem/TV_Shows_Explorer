import { useLocation, useNavigate } from "react-router";

export type Channel = "search" | "favorites" | "login";

const CHANNEL_BY_PATH: Record<string, Channel> = {
  "/": "search",
  "/favorites": "favorites",
  "/login": "login",
};

/** Какой канал на экране, решает адрес. Неизвестный адрес — поиск. */
export function useChannel() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const channel = CHANNEL_BY_PATH[pathname] ?? "search";

  return {
    channel,
    // С поиска — в избранное, с любого другого канала — обратно к поиску.
    toggleFavorites: () => navigate(channel === "search" ? "/favorites" : "/"),
  };
}
