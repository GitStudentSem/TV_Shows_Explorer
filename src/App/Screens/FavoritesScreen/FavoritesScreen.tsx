import { observer } from "mobx-react-lite";
import { Glyph } from "../components/Glyph/Glyph";
import { Loading } from "../components/Loading/Loading";
import { NoSignal } from "../components/NoSignal/NoSignal";
import { OffAir } from "../components/OffAir/OffAir";
import { ShowSlots } from "../components/ShowSlots/ShowSlots";
import styles from "./FavoritesScreen.module.css";
import { usePresenter } from "./logic/usePresenter";

/** Канал избранного на экране: страница сериалов, загрузка, ошибка или пустой список. */
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
        <OffAir title="Пока пусто" role="status">
          <p>
            Нажмите <Glyph>✧</Glyph> на карточке сериала, и он появится здесь.
          </p>
        </OffAir>
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
