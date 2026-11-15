import { observer } from "mobx-react-lite";
import { PageSwitch } from "../../components/PageSwitch/PageSwitch";
import { usePresenter } from "./logic/usePresenter";

export const SearchPagination = observer(function SearchPagination() {
  const { page, pageCount, onPrev, onNext } = usePresenter();

  return (
    <PageSwitch
      label="Страницы результатов"
      page={page}
      pageCount={pageCount}
      onPrev={onPrev}
      onNext={onNext}
    />
  );
});
