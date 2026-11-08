import { observer } from "mobx-react-lite";
import { ColorBars } from "../components/ColorBars/ColorBars";
import { MessagePanel } from "../components/MessagePanel/MessagePanel";
import styles from "./ErrorMessage.module.css";
import { usePresenter } from "./usePresenter";

export const ErrorMessage = observer(function ErrorMessage() {
  const { errorMessage, retry } = usePresenter();

  return (
    <ColorBars className={styles.message} role="alert">
      <MessagePanel title="Нет сигнала">
        <p>{errorMessage}</p>
        <button type="button" className={styles.button} onClick={retry}>
          Повторить
        </button>
      </MessagePanel>
    </ColorBars>
  );
});
