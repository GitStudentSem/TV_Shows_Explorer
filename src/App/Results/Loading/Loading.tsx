import styles from "./Loading.module.css";
import { usePresenter } from "./usePresenter";

export function Loading() {
  const { skeletonKeys } = usePresenter();

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
