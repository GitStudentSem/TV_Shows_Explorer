import { observer } from "mobx-react-lite";
import { EmptyMessage } from "./EmptyMessage/EmptyMessage";
import { ErrorMessage } from "./ErrorMessage/ErrorMessage";
import { GenreChips } from "./GenreChips/GenreChips";
import { Loading } from "./Loading/Loading";
import styles from "./Results.module.css";
import { ShowCard } from "./ShowCard/ShowCard";
import { usePresenter } from "./usePresenter";

export const Results = observer(function Results() {
  const { isLoading, isError, isEmpty, isSuccess, foundCount, visibleShows } =
    usePresenter();

  return (
    <>
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
    </>
  );
});
