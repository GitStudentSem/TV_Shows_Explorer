import { useNavigate } from "react-router";
import { userStore } from "../../../../../stores/UserStore";
import { logout } from "./tasks/logout";

export function usePresenter() {
  const navigate = useNavigate();
  const { status, email } = userStore;

  return {
    isChecking: status === "checking",
    isGuest: status === "guest",
    isAuthorized: status === "authorized",
    email: email ?? "",
    handleLogin: () => navigate("/login"),
    handleLogout: logout,
  };
}
