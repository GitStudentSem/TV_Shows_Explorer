import { observer } from "mobx-react-lite";
import { Loading } from "../components/Loading/Loading";
import { NoSignal } from "../components/NoSignal/NoSignal";
import { ShowSlots } from "../components/ShowSlots/ShowSlots";
import { EmptyMessage } from "./EmptyMessage/EmptyMessage";
import { IdleMessage } from "./IdleMessage/IdleMessage";
import { usePresenter } from "./logic/usePresenter";
import styles from "./SearchScreen.module.css";
import { WarmUpScreen } from "./WarmUpScreen/WarmUpScreen";

export interface SearchScreenProps {
  /** Телевизор ещё включается: вместо выдачи показываем кинескоп. */
  isWarmingUp: boolean;
}

/** Канал поиска на экране: выдача, загрузка, ошибка, «ничего не найдено» или ожидание запроса. */
export const SearchScreen = observer(function SearchScreen(
  props: SearchScreenProps,
) {
  const {
    isWarmingUp,
    isIdle,
    isLoading,
    isError,
    error,
    retry,
    isEmpty,
    isSuccess,
    foundCount,
    visibleShows,
  } = usePresenter(props);

  return (
    <div className={styles.results}>
      {isWarmingUp && <WarmUpScreen />}
      {isIdle && <IdleMessage />}
      {isLoading && <Loading />}
      {isError && <NoSignal error={error} onRetry={retry} />}
      {isEmpty && <EmptyMessage />}
      {isSuccess && (
        <>
          <p className={styles.count} role="status">
            Найдено: {foundCount}
          </p>
          <ShowSlots shows={visibleShows} />
        </>
      )}
    </div>
  );
});
