export const PAGE_SIZE = 3;

export interface PageOf<T> {
  items: T[];
  page: number;
  pageCount: number;
}

/** Страница за пределами выдачи прижимается к ближайшей существующей. */
export function paginate<T>(items: T[], requestedPage: number): PageOf<T> {
  const pageCount = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
  const page = Math.min(Math.max(requestedPage, 1), pageCount);
  const start = (page - 1) * PAGE_SIZE;

  return { items: items.slice(start, start + PAGE_SIZE), page, pageCount };
}
