import { observer } from "mobx-react-lite";
import { PageSwitch } from "../../components/PageSwitch/PageSwitch";
import { usePresenter } from "./logic/usePresenter";

interface SearchPaginationProps {
  isSearchOpen: boolean;
}

export const SearchPagination = observer(function SearchPagination({
  isSearchOpen,
}: SearchPaginationProps) {
  const { page, pageCount, onPrev, onNext } = usePresenter(isSearchOpen);

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
