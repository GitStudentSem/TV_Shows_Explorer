import { observer } from "mobx-react-lite";
import { TvButton } from "../../components/TvButton/TvButton";
import { usePresenter } from "./logic/usePresenter";
import styles from "./UserBadge.module.css";

export const UserBadge = observer(function UserBadge() {
  const {
    isChecking,
    isGuest,
    isAuthorized,
    email,
    handleLogin,
    handleLogout,
  } = usePresenter();

  return (
    <div className={styles.badge}>
      {isChecking && <span>…</span>}
      {isGuest && <TvButton onClick={handleLogin}>Войти</TvButton>}
      {isAuthorized && (
        <>
          <span className={styles.email} title={email}>
            {email}
          </span>
          <TvButton onClick={handleLogout}>Выйти</TvButton>
        </>
      )}
    </div>
  );
});
