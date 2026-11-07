# TV Shows Explorer

Поиск сериалов через [TVmaze API](https://www.tvmaze.com/api) с фильтрацией по жанрам и пагинацией.

Стек: React, MobX, TypeScript, Vite.

## Запуск

```bash
npm install
npm run dev
```

## Как устроены запросы

Запросы написаны без `useQuery`, логика находится в [`src/stores/ShowsStore.ts`](src/stores/ShowsStore.ts):

- поиск запускается через 400 мс после последнего символа, Enter запускает его сразу;
- `AbortController` отменяет предыдущий запрос, как только введён новый;
- состояния `idle`, `loading`, `success` и `error` хранятся в сторе, при ошибке есть кнопка «Повторить»;
- жанры, фильтрация и пагинация считаются на клиенте через computed-значения.
