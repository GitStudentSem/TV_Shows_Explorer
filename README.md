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
│   └── favorites.ts             fetchFavoriteIds, fetchFavoritesPage, putFavorite, deleteFavorite
├── stores/
│   ├── SearchStore.ts           параметры поиска и последняя страница выдачи
│   ├── FavoritesStore.ts        id избранного: звёздочки и счётчик
│   ├── FavoritesPageStore.ts    открытая страница канала «Избранное»
│   └── ToastStore.ts            текущее уведомление (данные, не текст)
├── tasks/
│   ├── loadFavoritesPage.ts     нужна каналу избранного и его переключателю страниц
│   └── loadShows.ts             загрузить выдачу по параметрам из стора
└── App/                         каркас: только <Screens /> (правило 8.12)
    └── Screens/                 корпус телевизора, какой «канал» на экране
        ├── logic/
        │   ├── usePresenter.ts  канал: поиск или избранное (навигация, 1.6)
        │   ├── useFavoritesLoader.ts грузит id избранного при старте (звёздочки, счётчик)
        │   ├── useWarmUp.ts     кинескоп при старте, пока сервер просыпается
        │   └── tasks/           wakeUpServer, loadFavoriteIds
        ├── Header/              название и полосы
        ├── ControlPanel/        панель на корпусе над экраном, одной высоты на всех каналах
        │   ├── SearchBar/       строка поиска (debounce, logic/tasks/searchByTerm.ts)
        │   └── GenreSelect/     выпадающий список жанров (logic/tasks/selectGenre.ts)
        ├── TvScreen/            кинескоп: один на все каналы, фиксированной высоты
        │   └── Toast/           бегущая строка «Срочно»: переживает смену канала (getToastText, таймер)
        ├── SearchScreen/        канал поиска на экране: выдача и её состояния
        │   ├── WarmUpScreen/    включение кинескопа
        │   └── EmptyMessage/    состояние «ничего не найдено»
        ├── FavoritesScreen/     канал избранного (logic/tasks/openFavorites.ts)
        ├── Footer/              ручки внизу корпуса, есть на любом канале
        │   ├── SearchPagination/    страницы выдачи (logic/tasks/goToPage.ts и др.)
        │   ├── FavoritesPagination/ страницы избранного (logic/tasks/goToFavoritesPage.ts и др.)
        │   └── FavoritesButton/ «✦ Избранное» со счётчиком
        └── components/          нужное обоим каналам (правило 4.2)
            ├── ShowSlots/       три слота под сериалы, пустой слот — рябь (Noise/)
            ├── Loading/         загрузка: все слоты в ряби
            ├── NoSignal/        профилактика: настроечная таблица, ошибка по коду, «Повторить»
            ├── PageSwitch/      ◀ табло ▶: кнопки гаснут, когда листать некуда
            ├── ShowCard/        карточка: выдача и избранное
            │   ├── FavoriteStar/ звёздочка (logic/tasks/toggleFavorite.ts)
            │   └── Poster/      постер или заглушка «Нет постера»
            ├── ColorBars/       настроечная таблица: NoSignal и заглушка постера
            ├── Glyph/           символ-иконка
            └── MessagePanel/    рамка для сообщений

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

- [`useTermDebounce`](src/App/Screens/ControlPanel/SearchBar/logic/useTermDebounce.ts) ждёт 370 мс
  после последнего символа и вызывает задачу
  [`searchByTerm`](src/App/Screens/ControlPanel/SearchBar/logic/tasks/searchByTerm.ts); Enter — сразу;
- жанр и страницу меняют задачи
  [`selectGenre`](src/App/Screens/ControlPanel/GenreSelect/logic/tasks/selectGenre.ts) и
  [`goToPage`](src/App/Screens/Footer/SearchPagination/logic/tasks/goToPage.ts). Каждая из трёх
  задач обновляет параметры в [`SearchStore`](src/stores/SearchStore.ts) и
  явно вызывает [`loadShows`](src/tasks/loadShows.ts) — правило 7.8;
- [`fetchShows`](src/api/shows.ts) отменяет предыдущий запрос поиска сам: один
  владелец отмены на три источника запросов — правило 8.9.1;
- пока меняются жанр или страница, на экране остаётся прошлая выдача, рябь
  вместо карточек показывается только для нового запроса;
- высота телевизора не зависит от состояния: панель поиска, экран на три слота
  и переключатель страниц есть всегда, а пустые слоты заполняет рябь.

Избранное:

- при старте [`loadFavoriteIds`](src/App/Screens/logic/tasks/loadFavoriteIds.ts)
  берёт только id (`GET /api/favorites/ids`): по ним горят звёздочки и считается кнопка;
- канал «Избранное» грузит по странице (`GET /api/favorites?page=`), пагинацию
  считает сервер (правило 9.1). Снятый со звезды сериал остаётся на экране с ✧,
  пока не сменится страница.

Сервер, `GET /api/shows?q=&genre=&page=`:

- [`getCached`](server/src/tasks/getCached.ts) отдаёт ответ TVmaze из кеша, если
  такой же запрос был меньше 5 минут назад, иначе запрашивает и обновляет кеш;
- [`searchShows`](server/src/tasks/searchShows/searchShows.ts) фильтрует по
  жанру, считает жанры и режет страницу. Смена жанра или страницы в TVmaze не
  ходит;
- ошибки приходят кодом: `{ error: "rate-limit" }` (429) или
  `{ error: "upstream" }` (502). Текст для пользователя делает клиент.

## На что обратить внимание при ревью

| Правило                                   | Пример в коде                                                                                                                                                                                     |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1.1 View — только JSX                     | [`SearchScreen.tsx`](src/App/Screens/SearchScreen/SearchScreen.tsx) — флаги и списки приходят готовыми                                                                                            |
| 1.2 Presenter готовит данные              | [`SearchScreen/logic/usePresenter.ts`](src/App/Screens/SearchScreen/logic/usePresenter.ts) — статусы стора превращаются в `isLoading`, `isEmpty` и т. д.                                          |
| 1.3 Логика в именованных хуках            | [`SearchBar/logic/useTermDebounce.ts`](src/App/Screens/ControlPanel/SearchBar/logic/useTermDebounce.ts), [`useFavoritesLoader`](src/App/Screens/logic/useFavoritesLoader.ts)                      |
| 8.12 `App` — только каркас                | [`App.tsx`](src/App/App.tsx) — только `<Screens />`, без Presenter'а                                                                                                                              |
| 3.1–3.3 Дерево папок = дерево компонентов | [`src/App/`](src/App/)                                                                                                                                                                            |
| 4.2 Локальная папка `components`          | [`Screens/components/`](src/App/Screens/components/) — `ShowCard` нужна и выдаче, и избранному                                                                                                    |
| 4.4 Задача лежит у своего компонента      | [`toggleFavorite`](src/App/Screens/components/ShowCard/FavoriteStar/logic/tasks/toggleFavorite.ts) у звёздочки, [`loadFavoritesPage`](src/tasks/loadFavoritesPage.ts) — глобальная: её зовут двое |
| 7.5 Локальное состояние в Presenter       | [`FavoriteStar/logic/usePresenter.ts`](src/App/Screens/components/ShowCard/FavoriteStar/logic/usePresenter.ts) — `isPending` клика, toast по результату задачи                                    |
| 7.9 Optimistic UI и откат в задаче        | [`toggleFavorite`](src/App/Screens/components/ShowCard/FavoriteStar/logic/tasks/toggleFavorite.ts) — стор меняется сразу, при ошибке сервера откатывается                                         |
| 8.11 Уведомление — данные                 | [`ToastStore`](src/stores/ToastStore.ts) хранит `kind`, текст — [`getToastText`](src/App/Screens/TvScreen/Toast/logic/getToastText.ts)                                                            |
| 7.1–7.5 Задача — обычная функция          | [`tasks/loadShows.ts`](src/tasks/loadShows.ts) — ввод, шаги, результат с кодом ошибки                                                                                                             |
| 7.8 Сменил параметр — вызови загрузку     | [`goToPage`](src/App/Screens/Footer/SearchPagination/logic/tasks/goToPage.ts) — ставит страницу и вызывает `loadShows`, реактивного загрузчика нет                                                |
| 8.1 View не обращается к стору            | Ни один `.tsx` не импортирует `stores/`: `grep -rl stores src/App --include='*.tsx'` пуст                                                                                                         |
| 8.2 Стор — только данные                  | [`SearchStore.ts`](src/stores/SearchStore.ts) — поля, геттеры и сеттеры без условий                                                                                                               |
| 8.9 Debounce в Presenter, отмена в `api/` | [`useTermDebounce`](src/App/Screens/ControlPanel/SearchBar/logic/useTermDebounce.ts), [`api/shows.ts`](src/api/shows.ts)                                                                          |
| 9.4 Слои сервера                          | [`routes/favorites.ts`](server/src/routes/favorites.ts) → [`tasks/addFavorite.ts`](server/src/tasks/addFavorite.ts) → [`storage/favorite.ts`](server/src/storage/favorite.ts)                     |

## Редактор

В [`.vscode/`](.vscode/) лежат настройки: Biome как форматтер по умолчанию,
форматирование и исправления при сохранении. VS Code предложит установить
расширение `biomejs.biome`.
