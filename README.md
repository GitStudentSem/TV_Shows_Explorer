# TV Shows Explorer

Домашнее задание по курсу об архитектуре фронтенда. Приложение ищет сериалы
через [TVmaze API](https://www.tvmaze.com/api), фильтрует их по жанрам и
разбивает выдачу на страницы.

Главное в проекте — архитектура, а не функциональность. Правила, по которым он
написан, собраны в [`ARCHITECTURE.md`](ARCHITECTURE.md); исходный конспект
урока лежит в [`conspects/Lesson_1.md`](conspects/Lesson_1.md).

Стек: React 19, MobX, TypeScript, Vite, Biome (линтер и форматтер).

## Быстрый старт

Нужен Node.js 22 или новее (проверено на Node 24). API-ключ не нужен, TVmaze
открытый.

```bash
npm install
npm run dev        # http://localhost:5173
```

## Команды

| Команда             | Что делает                                                  |
| ------------------- | ----------------------------------------------------------- |
| `npm run dev`       | Dev-сервер Vite с hot reload                                |
| `npm run build`     | Проверка типов (`tsc -b`) и production-сборка в `dist/`     |
| `npm run preview`   | Запуск собранной версии из `dist/`                          |
| `npm run check`     | Biome: линтер + форматирование + порядок импортов           |
| `npm run check:fix` | То же, с автоисправлением                                   |
| `npm run lint`      | Только линтер                                               |
| `npm run format`    | Только форматирование (с записью)                           |

## Как проверить проект

### 1. Автоматические проверки

```bash
npm run check   # должно быть: Checked N files ... без ошибок
npm run build   # типы и сборка проходят без ошибок
```

Часть архитектурных правил проверяется линтером автоматически, настройки в
[`biome.json`](biome.json):

- `noExcessiveLinesPerFile: 120` — правило 2.1, ни один файл не длиннее 120
  строк. Нарушение — ошибка, а не предупреждение;
- `useHookAtTopLevel` — хуки (`usePresenter` и вложенные) вызываются только на
  верхнем уровне.

Остальные правила (слои, структура папок, именование) проверяются глазами — ниже
описано, где и что смотреть.

### 2. Ручная проверка в браузере

После `npm run dev`:

| Сценарий                                                  | Ожидаемый результат                                         |
| --------------------------------------------------------- | ----------------------------------------------------------- |
| Ввести `girls` и подождать                                | Через ~400 мс появляется выдача и счётчик «Найдено: N»      |
| Ввести запрос и сразу нажать Enter                        | Поиск стартует без ожидания debounce                        |
| Быстро печатать, открыв DevTools → Network                | Предыдущие запросы помечены как `canceled`                  |
| Кликнуть по жанру                                         | Выдача и счётчик фильтруются, страница сбрасывается на 01   |
| Листать страницы (по 3 сериала на странице)               | Работают стрелки и номера, текущая страница подсвечена      |
| Ввести бессмыслицу, например `qqqzzzxxx`                  | Сообщение «Ничего не найдено»                               |
| DevTools → Network → Offline, затем ввести запрос          | Сообщение об ошибке и кнопка «Повторить»                    |

## Архитектура в двух словах

Каждый компонент разделён на два файла:

- **View** (`Component.tsx`) — только JSX и вызов `usePresenter()`. Никаких
  вычислений, форматирования и обработчиков с логикой.
- **Presenter** (`usePresenter.ts`) — достаёт данные из MobX-сторов и отдаёт View
  готовые значения и обработчики. Если Presenter разрастается, части выносятся
  в отдельные хуки с понятными именами (пример — `usePages` в
  [`Pagination/usePresenter.ts`](src/App/Pagination/usePresenter.ts)).

Поток данных:

```text
TVmaze API  →  src/api  →  src/stores (MobX)  →  usePresenter  →  View (JSX)
```

View никогда не обращается к сторам напрямую — только через свой Presenter.

## Где что лежит

Дерево папок `src/App` повторяет иерархию компонентов на экране (правило 3.1):

```text
src/
├── main.tsx                     точка входа, монтирует <App />
├── index.css                    глобальные стили
├── api/
│   └── tvmaze.ts                HTTP-запрос к TVmaze, тип Show, ApiError
├── stores/                      состояние приложения (MobX)
│   ├── SearchStore.ts           запрос, debounce, отмена, статусы загрузки
│   ├── ShowsListStore.ts        жанры, фильтр, пагинация поверх выдачи
│   └── getErrorMessage.ts       текст ошибки для пользователя
└── App/                         корневой компонент экрана
    ├── App.tsx                  каркас: шапка, SearchBar, Results, Pagination
    ├── SearchBar/               строка поиска
    ├── Results/                 область выдачи
    │   ├── Loading/             состояние «загрузка»
    │   ├── ErrorMessage/        состояние «ошибка» + «Повторить»
    │   ├── EmptyMessage/        состояние «ничего не найдено»
    │   ├── GenreChips/          фильтр по жанрам
    │   ├── ShowCard/            карточка сериала (+ formatShow.ts)
    │   └── components/          переиспользуемое только внутри Results
    │       ├── ColorBars/       декоративные полосы
    │       └── MessagePanel/    рамка для Loading / Error / Empty
    └── Pagination/              переключатель страниц
```

В каждой папке компонента лежат `Component.tsx` (View), `usePresenter.ts`
(Presenter) и `Component.module.css` (стили).

## На что обратить внимание при ревью

Соответствие правилам из [`ARCHITECTURE.md`](ARCHITECTURE.md) и где это видно:

| Правило                                     | Пример в коде                                                                                                                   |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| 1.1 View — только JSX                       | [`Results/Results.tsx`](src/App/Results/Results.tsx) — флаги и списки приходят готовыми                                         |
| 1.2 Presenter готовит данные                | [`Results/usePresenter.ts`](src/App/Results/usePresenter.ts) — статусы стора превращаются в `isLoading`, `isEmpty` и т. д.        |
| 1.3 Логика в именованных хуках              | [`Pagination/usePresenter.ts`](src/App/Pagination/usePresenter.ts) — `usePages`                                                 |
| 2.1 Не больше 120 строк                     | Проверяется `npm run check`; самый длинный TS-файл — [`SearchStore.ts`](src/stores/SearchStore.ts), 93 строки                    |
| 3.1–3.3 Дерево папок = дерево компонентов   | [`src/App/`](src/App/)                                                                                                          |
| 4.2 Локальная папка `components`            | [`Results/components/`](src/App/Results/components/) — используется только внутри ветки Results                                  |
| 5.1–5.2 Именование                          | `SearchBar/SearchBar.tsx` + `SearchBar/usePresenter.ts`                                                                         |
| 7.1 Стор читает только Presenter            | Ни один `.tsx` не импортирует `stores/`: `grep -rl stores src/App --include='*.tsx'` пуст                                        |
| 7.3.1 Ранний выход во View                  | [`Pagination/Pagination.tsx`](src/App/Pagination/Pagination.tsx) — `if (!isVisible) return null`                                |
| 7.4 Без логики — без Presenter              | [`App.tsx`](src/App/App.tsx) и [`MessagePanel`](src/App/Results/components/MessagePanel/MessagePanel.tsx) не имеют `usePresenter` |

## Как устроены запросы

Запросы написаны без `useQuery`, логика разделена на два MobX-стора:

- [`SearchStore`](src/stores/SearchStore.ts) — строка запроса, debounce,
  отмена запросов, статусы загрузки;
- [`ShowsListStore`](src/stores/ShowsListStore.ts) — жанры, фильтр и пагинация
  поверх полученной выдачи.

Поведение:

- поиск запускается через 400 мс после последнего символа, Enter запускает его
  сразу;
- `AbortController` отменяет предыдущий запрос, как только введён новый;
- состояния `idle`, `loading`, `success` и `error` хранятся в сторе, при ошибке
  есть кнопка «Повторить»;
- жанры, фильтрация и пагинация считаются на клиенте через computed-значения.

## Редактор

В [`.vscode/`](.vscode/) лежат настройки: Biome как форматтер по умолчанию,
форматирование и исправления при сохранении. VS Code предложит установить
расширение `biomejs.biome`.
