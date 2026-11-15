import { OffAir } from "../../components/OffAir/OffAir";

/** Запроса ещё нет: канал не настроен, на экране профилактика. */
export function IdleMessage() {
  return (
    <OffAir title="Канал не настроен" role="status">
      <p>Введите название сериала, чтобы поймать канал.</p>
    </OffAir>
  );
}
