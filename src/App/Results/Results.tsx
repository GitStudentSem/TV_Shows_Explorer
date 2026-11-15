import { observer } from "mobx-react-lite";
import { ShowCard } from "../components/ShowCard/ShowCard";
import { EmptyMessage } from "./EmptyMessage/EmptyMessage";
import { ErrorMessage } from "./ErrorMessage/ErrorMessage";
import { GenreChips } from "./GenreChips/GenreChips";
import { Loading } from "./Loading/Loading";
import { usePresenter } from "./logic/usePresenter";
import styles from "./Results.module.css";
import { WarmUpScreen } from "./WarmUpScreen/WarmUpScreen";

export interface ResultsProps {
  /** Телевизор ещё включается: вместо выдачи показываем кинескоп. */
  isWarmingUp: boolean;
}

export const Results = observer(function Results(props: ResultsProps) {
  const {
    isWarmingUp,
    isLoading,
    isError,
    isEmpty,
    isSuccess,
    foundCount,
    visibleShows,
  } = usePresenter(props);

  return (
    <div className={styles.results}>
      {isWarmingUp && <WarmUpScreen />}
      {isLoading && <Loading />}
      {isError && <ErrorMessage />}
      {isEmpty && <EmptyMessage />}
      {isSuccess && (
        <>
          <GenreChips />
          <p className={styles.count} role="status">
            Найдено: {foundCount}
          </p>
          <ul className={styles.list}>
            {visibleShows.map((show) => (
              <ShowCard key={show.id} show={show} />
            ))}
          </ul>
        </>
      )}
    </div>
  );
});
