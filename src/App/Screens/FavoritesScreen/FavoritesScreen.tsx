import { observer } from "mobx-react-lite";
import { Glyph } from "../components/Glyph/Glyph";
import { Loading } from "../components/Loading/Loading";
import { MessagePanel } from "../components/MessagePanel/MessagePanel";
import { NoSignal } from "../components/NoSignal/NoSignal";
import { ShowSlots } from "../components/ShowSlots/ShowSlots";
import styles from "./FavoritesScreen.module.css";
import { usePresenter } from "./logic/usePresenter";

/** Канал избранного на экране: страница сериалов, загрузка или ошибка. */
export const FavoritesScreen = observer(function FavoritesScreen() {
  const {
    isLoading,
    isError,
    error,
    retry,
    isEmpty,
    hasShows,
    countText,
    shows,
  } = usePresenter();

  return (
    <section className={styles.panel} aria-labelledby="favorites-title">
      {isLoading && <Loading />}
      {isError && <NoSignal error={error} onRetry={retry} />}
      {isEmpty && (
        <div className={styles.message}>
          <MessagePanel title="Пока пусто">
            <p>
              Нажмите <Glyph>✧</Glyph> на карточке сериала, и он появится здесь.
            </p>
          </MessagePanel>
        </div>
      )}
      {hasShows && (
        <>
          <p className={styles.note}>{countText}</p>
          <ShowSlots shows={shows} />
        </>
      )}
    </section>
  );
});
