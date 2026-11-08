import { observer } from "mobx-react-lite";
import styles from "./Pagination.module.css";
import { usePresenter } from "./usePresenter";

export const Pagination = observer(function Pagination() {
  const { isVisible, isFirstPage, isLastPage, goPrev, goNext, pages } =
    usePresenter();

  if (!isVisible) return null;

  return (
    <nav className={styles.pagination} aria-label="Страницы результатов">
      <button
        type="button"
        className={styles.step}
        disabled={isFirstPage}
        aria-label="Предыдущая страница"
        onClick={goPrev}
      >
        ◀
      </button>

      <ol className={styles.pages}>
        {pages.map((page) => (
          <li key={page.number}>
            <button
              type="button"
              className={styles.page}
              aria-label={page.ariaLabel}
              aria-current={page.ariaCurrent}
              onClick={page.onClick}
            >
              {page.label}
            </button>
          </li>
        ))}
      </ol>

      <button
        type="button"
        className={styles.step}
        disabled={isLastPage}
        aria-label="Следующая страница"
        onClick={goNext}
      >
        ▶
      </button>
    </nav>
  );
});
