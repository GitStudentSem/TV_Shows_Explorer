import type { Show } from "../../../../api/shows";
import { ShowCard } from "../ShowCard/ShowCard";
import { usePresenter } from "./logic/usePresenter";
import { Noise } from "./Noise/Noise";
import styles from "./ShowSlots.module.css";

export interface ShowSlotsProps {
  shows: Show[];
}

/**
 * Экран всегда поделён на одинаковые слоты под сериалы. Слот без сериала
 * показывает рябь: так выглядит и загрузка, и неполная последняя страница.
 */
export function ShowSlots(props: ShowSlotsProps) {
  const { shows, emptySlotKeys } = usePresenter(props);

  return (
    <ul className={styles.slots}>
      {shows.map((show) => (
        <ShowCard key={show.id} show={show} />
      ))}
      {emptySlotKeys.map((key) => (
        <Noise key={key} />
      ))}
    </ul>
  );
}
