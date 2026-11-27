import { type ChangeEvent, type FormEvent, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { getLoginErrorText } from "./getLoginErrorText";
import { type LoginErrorCode, login } from "./tasks/login";

export function usePresenter() {
  // Ввод, ожидание и ошибка нужны только этой форме — локальное состояние (7.5).
  const [email, setEmail] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<LoginErrorCode | null>(null);
  const navigate = useNavigate();
  // Откуда пришли на вход: туда и вернёмся (например, в избранное).
  const from = (useLocation().state as { from?: string } | null)?.from ?? "/";

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isPending) return;
    setIsPending(true);
    setError(null);
    const result = await login(email);
    setIsPending(false);

    if (result.error) return setError(result.error);
    navigate(from, { replace: true });
  };

  return {
    email,
    handleEmailChange: (event: ChangeEvent<HTMLInputElement>) =>
      setEmail(event.target.value),
    isSubmitDisabled: isPending || email.trim() === "",
    submitLabel: isPending ? "Входим…" : "Войти",
    hasError: error !== null,
    errorText: error ? getLoginErrorText(error) : "",
    handleSubmit,
  };
}
