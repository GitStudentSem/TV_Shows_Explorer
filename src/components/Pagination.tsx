import { observer } from 'mobx-react-lite'
import { showsStore } from '../stores/ShowsStore'

export const Pagination = observer(function Pagination() {
  const { page, pageCount } = showsStore

  if (pageCount < 2) return null

  return (
    <nav className="pagination" aria-label="Страницы результатов">
      <button
        type="button"
        className="pagination__step"
        disabled={page === 1}
        aria-label="Предыдущая страница"
        onClick={() => showsStore.setPage(page - 1)}
      >
        ◀
      </button>

      <ol className="pagination__pages">
        {Array.from({ length: pageCount }, (_, index) => index + 1).map((number) => (
          <li key={number}>
            <button
              type="button"
              className="pagination__page"
              aria-label={`Страница ${number}`}
              aria-current={number === page ? 'page' : undefined}
              onClick={() => showsStore.setPage(number)}
            >
              {String(number).padStart(2, '0')}
            </button>
          </li>
        ))}
      </ol>

      <button
        type="button"
        className="pagination__step"
        disabled={page === pageCount}
        aria-label="Следующая страница"
        onClick={() => showsStore.setPage(page + 1)}
      >
        ▶
      </button>
    </nav>
  )
})
