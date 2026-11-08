import { observer } from "mobx-react-lite";
import { MessagePanel } from "../components/MessagePanel/MessagePanel";
import styles from "./EmptyMessage.module.css";
import { usePresenter } from "./usePresenter";

export const EmptyMessage = observer(function EmptyMessage() {
  const { query } = usePresenter();

  return (
    <div className={styles.message} role="status">
      <MessagePanel title="Ничего не найдено">
        <p>
          По запросу «{query}» на этом канале пусто. Попробуйте другое название.
        </p>
      </MessagePanel>
    </div>
  );
});
