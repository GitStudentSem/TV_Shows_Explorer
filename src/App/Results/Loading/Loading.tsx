import styles from "./Loading.module.css";
import { usePresenter } from "./logic/usePresenter";
import { WarmUpScreen } from "./WarmUpScreen/WarmUpScreen";

export function Loading() {
  const { isWarmingUp, skeletonKeys } = usePresenter();

  if (isWarmingUp) return <WarmUpScreen />;

  return (
    <div
      className={styles.skeletons}
      role="status"
      aria-label="Загрузка результатов"
    >
      {skeletonKeys.map((key) => (
        <div key={key} className={styles.skeleton} />
      ))}
    </div>
  );
}
