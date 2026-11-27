import { useNavigate } from "react-router";

export const usePresenter = () => {
  const navigate = useNavigate();
  return {
    handleLogin: () => navigate("/login", { state: { from: "/favorites" } }),
  };
};
