import { observer } from "mobx-react-lite";
import { Glyph } from "../components/Glyph/Glyph";
import { MessagePanel } from "../components/MessagePanel/MessagePanel";
import { ShowCard } from "../components/ShowCard/ShowCard";
import styles from "./FavoritesPanel.module.css";
import { usePresenter } from "./logic/usePresenter";

export const FavoritesPanel = observer(function FavoritesPanel() {
  const { isLoading, isError, isEmpty, hasShows, countText, shows, retry } =
    usePresenter();

  return (
    <section className={styles.panel} aria-labelledby="favorites-title">
      <h2 id="favorites-title" className={styles.title}>
        Избранное
      </h2>

      {isLoading && (
        <p className={styles.note} role="status">
          Настраиваем канал…
        </p>
      )}
      {isError && (
        <div className={styles.message} role="alert">
          <MessagePanel title="Нет сигнала">
            <p>Не удалось загрузить избранное. Попробуйте ещё раз.</p>
            <button type="button" className={styles.button} onClick={retry}>
              Повторить
            </button>
          </MessagePanel>
        </div>
      )}
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
          <ul className={styles.list}>
            {shows.map((show) => (
              <ShowCard key={show.id} show={show} />
            ))}
          </ul>
        </>
      )}
    </section>
  );
});
