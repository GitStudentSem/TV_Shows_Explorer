# TV Shows Explorer

Домашнее задание по курсу об архитектуре фронтенда: поиск сериалов с фильтром
по жанрам, страницами и избранным. Данные берутся из
[TVmaze API](https://www.tvmaze.com/api) через собственный сервер.

**Открыть:** https://gitstudentsem.github.io/TV_Shows_Explorer/

Главное в проекте — архитектура. Правила собраны в
[`ARCHITECTURE.md`](ARCHITECTURE.md), конспекты уроков лежат в
[`conspects/`](conspects/).

## Быстрый старт

Нужен Node.js 24 или новее. API-ключ не нужен.

```bash
npm install   # зависимости клиента и сервера
npm run dev   # клиент http://localhost:5173 + сервер http://localhost:3000
```

## Команды

| Команда                    | Что делает                                                  |
| -------------------------- | ----------------------------------------------------------- |
| `npm run dev`              | Клиент и сервер вместе с hot reload                         |
| `npm run dev:client`       | Только Vite                                                 |
| `npm run dev:server`       | Только сервер (`node --watch`)                              |
| `npm run build`            | Проверка типов клиента и сборка в `dist/`                   |
| `npm run typecheck:server` | Проверка типов сервера                                      |
| `npm run check`            | Biome по всему репозиторию: линтер, форматирование, импорты |
| `npm run check:fix`        | То же, с автоисправлением                                   |

## Деплой

Клиент и сервер деплоятся отдельно:

| Часть  | Где                                                  | Как                                                                                             |
| ------ | ---------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| Клиент | GitHub Pages                                         | [`deploy.yml`](.github/workflows/deploy.yml) на каждый push в `main`, кроме изменений `server/` |
| Сервер | [Render](https://render.com), бесплатный Web Service | [`render.yaml`](render.yaml): Root Directory `server`, `npm ci`, `npm start`                    |

- Адрес сервера клиент получает при сборке из переменной репозитория
  `VITE_API_URL` (Settings → Secrets and variables → Actions → Variables).
- Сервер принимает запросы только с домена Pages (`CORS_ORIGIN` в
  `render.yaml`).

Бесплатный Render засыпает после 15 минут без запросов. Первый запрос после
этого идёт до минуты, а кеш и избранное, которые живут в памяти, обнуляются.
