import { observer } from "mobx-react-lite";
import { PageSwitch } from "../../components/PageSwitch/PageSwitch";
import { usePresenter } from "./logic/usePresenter";

export const FavoritesPagination = observer(function FavoritesPagination() {
  const { page, pageCount, onPrev, onNext } = usePresenter();

  return (
    <PageSwitch
      label="Страницы избранного"
      page={page}
      pageCount={pageCount}
      onPrev={onPrev}
      onNext={onNext}
    />
  );
});
