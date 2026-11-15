import { observer } from "mobx-react-lite";
import { OffAir } from "../../components/OffAir/OffAir";
import { usePresenter } from "./logic/usePresenter";

/** Пустая выдача — тоже сбой канала, поэтому на экране профилактика. */
export const EmptyMessage = observer(function EmptyMessage() {
  const { searchedTerm } = usePresenter();

  return (
    <OffAir title="Ничего не найдено" role="status">
      <p>
        По запросу «{searchedTerm}» на этом канале пусто. Попробуйте другое
        название.
      </p>
    </OffAir>
  );
});
