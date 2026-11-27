import { TvButton } from "../components/TvButton/TvButton";
import styles from "./LoginScreen.module.css";
import { usePresenter } from "./logic/usePresenter";

export function LoginScreen() {
  const {
    email,
    handleEmailChange,
    handleSubmit,
    isSubmitDisabled,
    submitLabel,
    hasError,
    errorText,
  } = usePresenter();

  return (
    <section className={styles.panel} aria-labelledby="login-title">
      <h2 id="login-title" className={styles.title}>
        Вход
      </h2>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="login-email">
            Электронная почта
          </label>
          <input
            id="login-email"
            name="email"
            className={styles.input}
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={handleEmailChange}
          />
        </div>
        {hasError && (
          <p className={styles.error} role="alert">
            {errorText}
          </p>
        )}
        <TvButton type="submit" disabled={isSubmitDisabled}>
          {submitLabel}
        </TvButton>
      </form>
    </section>
  );
}
