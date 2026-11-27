import { OffAir } from "../../components/OffAir/OffAir";
import { TvButton } from "../../components/TvButton/TvButton";
import { usePresenter } from "./logic/usePresenter";

export function LoginPrompt() {
  const { handleLogin } = usePresenter();

  return (
    <OffAir title="Избранное доступно после входа" role="status">
      <TvButton onClick={handleLogin}>Войти</TvButton>
    </OffAir>
  );
}
