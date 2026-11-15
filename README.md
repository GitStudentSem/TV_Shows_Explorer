# TV Shows Explorer

Домашнее задание по курсу об архитектуре фронтенда. Приложение ищет сериалы,
фильтрует их по жанрам, разбивает выдачу на страницы и хранит избранное.
Данные берутся из
[TVmaze API](https://www.tvmaze.com/api) через собственный сервер.

Главное в проекте — архитектура, а не функциональность. Правила, по которым он
написан, собраны в [`ARCHITECTURE.md`](ARCHITECTURE.md); исходные конспекты
уроков лежат в [`conspects/`](conspects/).

Стек:

- клиент (`src/`) — React 19, MobX, TypeScript, Vite;
- сервер (`server/`) — Node 24, Express 5, TypeScript;
- Biome — линтер и форматтер для обоих.

## Быстрый старт

Нужен Node.js 24 или новее: сервер запускает `.ts` напрямую, без сборки.
API-ключ не нужен, TVmaze открытый.

```bash
npm install        # зависимости клиента и сервера
npm run dev        # клиент http://localhost:5173 + сервер http://localhost:3000
```

В dev-режиме Vite проксирует `/api/*` на сервер, так что клиент и сервер живут
на одном адресе.

## Деплой

Клиент и сервер лежат в одном репозитории, но деплоятся отдельно:

| Часть  | Где                                                  | Как                                                                                             |
| ------ | ---------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| Клиент | GitHub Pages                                         | [`deploy.yml`](.github/workflows/deploy.yml) на каждый push в `main`, кроме изменений `server/` |
| Сервер | [Render](https://render.com), бесплатный Web Service | [`render.yaml`](render.yaml): Root Directory `server`, `npm ci`, `npm start`                    |

Связка:

- адрес сервера клиент получает при сборке из переменной репозитория
  `VITE_API_URL` (Settings → Secrets and variables → Actions → Variables);
- сервер принимает запросы только с домена Pages (`CORS_ORIGIN` в
  `render.yaml`).

Сервер должен быть постоянно запущенным процессом, а не serverless-функцией:
кеш и избранное живут в памяти (правило 9.7). На бесплатном плане Render
засыпает после 15 минут без запросов: первый запрос после этого ждёт
полминуты, а кеш и избранное обнуляются. Для учебного проекта без базы данных
это ожидаемо.

## Команды

| Команда                    | Что делает                                                  |
| -------------------------- | ----------------------------------------------------------- |
| `npm run dev`              | Клиент и сервер вместе с hot reload                         |
| `npm run dev:client`       | Только Vite                                                 |
| `npm run dev:server`       | Только сервер (`node --watch`)                              |
| `npm run build`            | Проверка типов клиента (`tsc -b`) и сборка в `dist/`        |
| `npm run typecheck:server` | Проверка типов сервера                                      |
| `npm run check`            | Biome по всему репозиторию: линтер, форматирование, импорты |
| `npm run check:fix`        | То же, с автоисправлением                                   |

## Как проверить проект

### 1. Автоматические проверки

```bash
npm run check              # Checked N files ... без ошибок
npm run build              # типы и сборка клиента
npm run typecheck:server   # типы сервера
```

Часть архитектурных правил проверяется линтером автоматически, настройки в
[`biome.json`](biome.json):

- `noExcessiveLinesPerFile: 120` — правило 2.1, ни один файл кода не длиннее
  120 строк (`.md` не в счёт). Нарушение — ошибка, а не предупреждение;
- `useHookAtTopLevel` — хуки (`usePresenter` и вложенные) вызываются только на
  верхнем уровне.

Остальные правила (слои, структура папок, именование) проверяются глазами — ниже
описано, где и что смотреть.

### 2. Ручная проверка в браузере

После `npm run dev`:

| Сценарий                                     | Ожидаемый результат                                         |
| -------------------------------------------- | ----------------------------------------------------------- |
| Ввести `girls` и подождать                   | Через ~370 мс появляется выдача и счётчик «Найдено: N»      |
| Ввести запрос и сразу нажать Enter           | Поиск стартует без ожидания debounce                        |
| Быстро печатать, открыв DevTools → Network   | Устаревшие запросы `/api/shows` помечены как `canceled`     |
| Кликнуть по жанру                            | Выдача и счётчик фильтруются, страница сбрасывается на 01   |
| Листать страницы (по 3 сериала на странице)  | Работают стрелки и номера, текущая страница подсвечена      |
| Ввести бессмыслицу, например `qqqzzzxxx`     | Сообщение «Ничего не найдено»                               |
| Остановить сервер, ввести запрос             | Сообщение об ошибке и кнопка «Повторить»                    |
| Нажать ☆ на карточке                         | Звёздочка закрашена, toast «добавлен», счётчик на кнопке +1 |
| Нажать «★ Избранное»                         | На экране список избранного, кнопка — «← К поиску»          |
| Нажать ★ в списке избранного                 | Карточка пропадает, toast «убран», выдача поиска на месте   |
| Перезагрузить страницу                       | Избранное сохранилось: оно на сервере                       |
| Повторить тот же поиск, смотреть лог сервера | `cache hit search:girls`: в TVmaze запрос не ушёл           |

## Архитектура в двух словах

Слои VIPER: View (`Component.tsx`, только JSX), Presenter (`logic/usePresenter.ts`),
Task (`tasks/`, бизнес-логика), Entity (MobX-сторы). Полные правила — в
[`ARCHITECTURE.md`](ARCHITECTURE.md).

Что где живёт (раздел 9):

| Backend                                                         | Frontend                                                         |
| --------------------------------------------------------------- | ---------------------------------------------------------------- |
| Запросы к TVmaze и кеш на 5 минут                               | Не знает о TVmaze, ходит только в `/api`                         |
| Фильтр по жанру, пагинация, подсчёт жанров                      | Передаёт `q`, `genre`, `page` и показывает готовую страницу      |
| Избранное: `const favorite = {}`, данные шоу берёт у TVmaze сам | Шлёт только id, держит копию списка для звёздочек и счётчика     |
| —                                                               | Debounce, отмена запросов, тексты ошибок и toast, форматирование |

Поток данных:

```text
View ─событие─▶ Presenter ─▶ Task ─▶ src/api ─HTTP─▶ routes ─▶ tasks ─▶ storage / TVmaze
  ▲                │          └─▶ src/stores (MobX)
  └── готовые значения ──┘
```

View никогда не обращается к сторам напрямую — только через свой Presenter.

## Где что лежит

Дерево папок `src/App` повторяет иерархию компонентов на экране (правило 3.1):

```text
src/
├── main.tsx                     точка входа, монтирует <App />
├── api/                         общение с нашим сервером
│   ├── client.ts                базовый запрос, ApiError с кодом ошибки
│   ├── shows.ts                 fetchShows, типы выдачи
│   └── favorites.ts             fetchFavorites, putFavorite, deleteFavorite
├── stores/
│   ├── SearchStore.ts           параметры поиска и последняя страница выдачи
│   ├── FavoritesStore.ts        копия избранного с сервера
│   └── ToastStore.ts            текущее уведомление (данные, не текст)
├── tasks/
│   └── loadFavorites.ts         нужна App (при старте) и списку (Повторить)
└── App/                         корневой компонент экрана
    ├── logic/
    │   ├── usePresenter.ts      какой «канал» на экране: поиск или избранное
    │   ├── useShowsLoader.ts    владелец AbortController, запускает поиск
    │   ├── useFavoritesLoader.ts грузит избранное при старте
    │   └── tasks/searchShows.ts задача: запросить страницу и положить в стор
    ├── FavoritesButton/         «★ Избранное» со счётчиком
    ├── FavoritesPanel/          список избранного вместо выдачи
    ├── Toast/                   уведомление (logic/getToastText.ts, таймер)
    ├── components/              нужное в нескольких ветках App (правило 4.2)
    │   ├── ShowCard/            карточка: выдача и избранное
    │   │   ├── FavoriteStar/    звёздочка (logic/tasks/toggleFavorite.ts)
    │   │   └── Poster/          постер или заглушка «Нет постера»
    │   ├── ColorBars/           декоративные полосы
    │   └── MessagePanel/        рамка для сообщений
    ├── SearchBar/               строка поиска (logic/useTermDebounce.ts — debounce)
    ├── Results/                 область выдачи
    │   ├── Loading/             состояние «загрузка»
    │   ├── ErrorMessage/        «ошибка» + «Повторить» (logic/getErrorText.ts)
    │   ├── EmptyMessage/        состояние «ничего не найдено»
    │   └── GenreChips/          фильтр по жанрам
    └── Pagination/              переключатель страниц

server/src/
├── index.ts, app.ts             запуск и сборка Express-приложения
├── routes/                      разбор HTTP-запроса и статусы, без логики
├── tasks/                       бизнес-логика: кеш, поиск, фильтр, пагинация, избранное
├── storage/                     данные в памяти: cache.ts, favorite.ts
└── api/tvmaze.ts                запросы к TVmaze
```

В каждой папке компонента лежат `Component.tsx` (View), `Component.module.css`
(стили) и папка `logic/` с Presenter'ом и его вспомогательными функциями
(правило 3.4).

## Как устроены запросы

Клиент:

- [`useTermDebounce`](src/App/SearchBar/logic/useTermDebounce.ts) ждёт 370 мс
  после последнего символа и записывает запрос в стор; Enter — сразу;
- жанр и страница меняются синхронными методами
  [`SearchStore`](src/stores/SearchStore.ts);
- [`useShowsLoader`](src/App/logic/useShowsLoader.ts) реагирует на любую смену
  параметров: отменяет прошлый запрос и вызывает задачу
  [`searchShows`](src/App/logic/tasks/searchShows.ts). Один владелец отмены на
  три источника запросов — правило 8.9.1;
- пока меняются жанр или страница, на экране остаётся прошлая выдача, скелетон
  показывается только для нового запроса.

Сервер, `GET /api/shows?q=&genre=&page=`:

- [`getCached`](server/src/tasks/getCached.ts) отдаёт ответ TVmaze из кеша, если
  такой же запрос был меньше 5 минут назад, иначе запрашивает и обновляет кеш;
- [`searchShows`](server/src/tasks/searchShows/searchShows.ts) фильтрует по
  жанру, считает жанры и режет страницу. Смена жанра или страницы в TVmaze не
  ходит;
- ошибки приходят кодом: `{ error: "rate-limit" }` (429) или
  `{ error: "upstream" }` (502). Текст для пользователя делает клиент.

## На что обратить внимание при ревью

| Правило                                   | Пример в коде                                                                                                                                                                     |
| ----------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1.1 View — только JSX                     | [`Results/Results.tsx`](src/App/Results/Results.tsx) — флаги и списки приходят готовыми                                                                                           |
| 1.2 Presenter готовит данные              | [`Results/logic/usePresenter.ts`](src/App/Results/logic/usePresenter.ts) — статусы стора превращаются в `isLoading`, `isEmpty` и т. д.                                            |
| 1.3 Логика в именованных хуках            | [`SearchBar/logic/useTermDebounce.ts`](src/App/SearchBar/logic/useTermDebounce.ts), `usePages` в Pagination                                                                       |
| 3.1–3.3 Дерево папок = дерево компонентов | [`src/App/`](src/App/)                                                                                                                                                            |
| 4.2 Локальная папка `components`          | [`App/components/`](src/App/components/) — `ShowCard` нужна и выдаче, и избранному                                                                                                |
| 4.4 Задача лежит у своего компонента      | [`toggleFavorite`](src/App/components/ShowCard/FavoriteStar/logic/tasks/toggleFavorite.ts) у звёздочки, [`loadFavorites`](src/tasks/loadFavorites.ts) — глобальная: её зовут двое |
| 7.5 Локальное состояние в Presenter       | [`FavoriteStar/logic/usePresenter.ts`](src/App/components/ShowCard/FavoriteStar/logic/usePresenter.ts) — `isPending` клика, toast по результату задачи                            |
| 8.11 Уведомление — данные                 | [`ToastStore`](src/stores/ToastStore.ts) хранит `kind`, текст — [`getToastText`](src/App/Toast/logic/getToastText.ts)                                                             |
| 7.1–7.5 Задача — обычная функция          | [`App/logic/tasks/searchShows.ts`](src/App/logic/tasks/searchShows.ts) — ввод, шаги, результат с кодом ошибки                                                                     |
| 8.1 View не обращается к стору            | Ни один `.tsx` не импортирует `stores/`: `grep -rl stores src/App --include='*.tsx'` пуст                                                                                         |
| 8.9 Debounce и отмена — в Presenter       | Стор без таймеров и контроллеров: [`SearchStore.ts`](src/stores/SearchStore.ts)                                                                                                   |
| 9.4 Слои сервера                          | [`routes/favorites.ts`](server/src/routes/favorites.ts) → [`tasks/addFavorite.ts`](server/src/tasks/addFavorite.ts) → [`storage/favorite.ts`](server/src/storage/favorite.ts)     |

## Редактор

В [`.vscode/`](.vscode/) лежат настройки: Biome как форматтер по умолчанию,
форматирование и исправления при сохранении. VS Code предложит установить
расширение `biomejs.biome`.
