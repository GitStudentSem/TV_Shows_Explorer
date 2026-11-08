import { observer } from "mobx-react-lite";
import { MessagePanel } from "../components/MessagePanel/MessagePanel";
import styles from "./EmptyMessage.module.css";
import { usePresenter } from "./usePresenter";

export const EmptyMessage = observer(function EmptyMessage() {
  const { searchedTerm } = usePresenter();

  return (
    <div className={styles.message} role="status">
      <MessagePanel title="Ничего не найдено">
        <p>
          По запросу «{searchedTerm}» на этом канале пусто. Попробуйте другое
          название.
        </p>
        <span className={styles.testCard} aria-hidden="true">
          Настроечная таблица 0249-ПС
        </span>
      </MessagePanel>
    </div>
  );
});
