# План фронтенда для ДЗ №3: авторизация и персональное избранное

Сервер готов (коммит `fb90660`). Этот план описывает только клиент. Каждый шаг — отдельный коммит, после каждого шага приложение собирается и работает.

## Контракт сервера

| Запрос                            | Ответ                | Ошибки                  |
| --------------------------------- | -------------------- | ----------------------- |
| `POST /api/auth/login`            | `{ token, email }`   | 400 `invalid-email`     |
| `GET /api/auth/me`                | `{ email }`          | 401 `unauthorized`      |
| `POST /api/auth/logout`           | 204, можно повторять | —                       |
| `GET /api/favorites/ids`          | `number[]`           | 401                     |
| `GET /api/favorites?page=`        | `FavoritesPage`      | 401                     |
| `PUT / DELETE /api/favorites/:id` | `Show` / 204         | 401, 400, 404, 429, 502 |

Токен передаётся заголовком `Authorization: Bearer <token>`. Сессии живут в памяти сервера: после того как Render заснул или перезапустился, любой токен даёт 401. Email сервер нормализует: `A@x.ru` и `a@x.ru` — один пользователь.

## Сквозные решения

1. **Токен знает только `api/`** (7.6). Задачи и сторы его не видят. Вход для задачи — это «email на входе, email на выходе».
2. **Текущий пользователь хранится в `userStore`.** Это глобальные данные: их читают шапка, звёздочки, кнопка и экран избранного.
3. **На 401 `api/` стирает токен, а задача явно вызывает `endSession()`.** `api/` не импортирует сторы (1.7). Подписку «api сообщает о 401» не делаем: это реакция, а её запрещает 7.8.
4. **Навигация через `react-router` с `HashRouter`.** Канал определяется адресом: `/`, `/favorites`, `/login`. `navigate` вызывает только Presenter (1.6).
5. **Гостя не перенаправляем автоматически.** Экран избранного показывает гостю приглашение войти, а звёздочка по клику ведёт на `/login`. Так не бывает двух `navigate` подряд, например после выхода на `/favorites`.

## Оглавление

- [x] [Шаг 1. Слой `api/`: токен, коды 401/400, запросы авторизации](#шаг-1-слой-api)
- [ ] [Шаг 1.1. Убрать `src/utils/`](#шаг-11-убрать-srcutils)
- [ ] [Шаг 2. `UserStore`, `endSession`, общая `loadFavoriteIds`](#шаг-2-userstore-endsession-общая-loadfavoriteids)
- [ ] [Шаг 3. Роутер и каналы по адресу](#шаг-3-роутер-и-каналы-по-адресу)
- [ ] [Шаг 4. Восстановление сессии при старте](#шаг-4-восстановление-сессии-при-старте)
- [ ] [Шаг 5. Страница входа](#шаг-5-страница-входа)
- [ ] [Шаг 6. Email и «Выйти» в шапке](#шаг-6-email-и-выйти-в-шапке)
- [ ] [Шаг 7. Ограничения для гостя](#шаг-7-ограничения-для-гостя)
- [ ] [Шаг 8. Ответ 401 посреди работы](#шаг-8-ответ-401-посреди-работы)
- [ ] [Шаг 9. ARCHITECTURE.md](#шаг-9-architecturemd)
- [ ] [Шаг 10. Ручная проверка и PR](#шаг-10-ручная-проверка-и-pr)

---

## Шаг 1. Слой `api/`

**Статус:** готово, коммит `4e09fcc add api methods for login`.

Что сделано:

- `src/api/token.ts` — токен в памяти с копией в `localStorage`; функции `getToken`, `saveToken`, `clearToken`.
- `src/api/client.ts`:
  - `request` подставляет `Authorization`;
  - на 401 стирает токен, но только если за время запроса не появился новый;
  - новые коды `unauthorized` и `bad-request`.
- `src/api/auth.ts`:
  - `postLogin` сохраняет токен и возвращает `{ email }`;
  - `fetchMe`;
  - `postLogout` стирает токен в `finally`;
  - `hasToken`.
- В `getErrorText.ts` добавлены тексты для новых кодов.

---

## Шаг 1.1. Убрать `src/utils/`

**Зачем.** Правило 8.8 перечисляет глобальные папки клиента: `api/`, `stores/`, `tasks/`, `components/`. Папки `utils/` в нём нет. Кроме того, `STORAGE_NAMES` нарушает 7.6:

- ключ `TOKEN` нужен только `api/token.ts`, но вынесен туда, откуда его может импортировать кто угодно;
- ключ `FAVORITE_IDS` нигде не используется.

**Что сделать:**

- [ ] Перенести ключ в `api/token.ts` константой: `const STORAGE_KEY = "tv-shows-explorer:token";`.
- [ ] Удалить `src/utils/storageNames.ts` и папку `src/utils/`.

**Альтернатива.** Если `utils/` нужна под что-то ещё, сначала обсудим и допишем правило 8.8 (так требует CLAUDE.md: правило противоречит коду — сначала обсуждаем).

**Коммит:** `move token storage key into api`.

---

## Шаг 2. `UserStore`, `endSession`, общая `loadFavoriteIds`

**Зачем.** Задачам входа, выхода и обработки 401 нужно где-то хранить текущего пользователя и одинаково чистить его данные.

### 2.1. `src/stores/UserStore.ts` — новый файл

```ts
import { makeAutoObservable } from "mobx";

/** checking — при старте ещё не знаем, жива ли сохранённая сессия. */
export type UserStatus = "checking" | "guest" | "authorized";

/** Кто сейчас пользуется приложением. Токена здесь нет: он деталь api/ (7.6). */
export class UserStore {
  email: string | null = null;
  status: UserStatus = "checking";

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  get isAuthorized(): boolean {
    return this.status === "authorized";
  }

  setUser(email: string) {
    this.email = email;
    this.status = "authorized";
  }

  setGuest() {
    this.email = null;
    this.status = "guest";
  }
}

export const userStore = new UserStore();
```

Почему статус отдельно от email: пока идёт `GET /me`, мы не знаем, гость это или нет. Без статуса `checking` при каждой загрузке на долю секунды мелькали бы «Войти» и пустые звёздочки.

### 2.2. `FavoritesStore` — метод `clear()`

```ts
/** У гостя избранного нет: пусто и известно, что пусто. */
clear() {
  this.ids = new Set();
  this.status = "ready";
}
```

Почему `ready`, а не `loading`: иначе кнопка «Избранное» у гостя навсегда показывала бы `…`.

### 2.3. `src/tasks/endSession.ts` — новая задача

```ts
import { favoritesPageStore } from "../stores/FavoritesPageStore";
import { favoritesStore } from "../stores/FavoritesStore";
import { userStore } from "../stores/UserStore";

/**
 * Сессии больше нет: пользователь вышел или сервер его забыл (401).
 * Убираем всё, что принадлежало пользователю. Токен стирает api/ сам.
 */
export function endSession() {
  userStore.setGuest();
  favoritesStore.clear();
  favoritesPageStore.reset();
}
```

Её вызывают выход (шаг 6), старт без сессии (шаг 4) и все задачи, получившие `unauthorized` (шаги 2.4 и 8). Поэтому задача глобальная (4.4).

### 2.4. Перенести `loadFavoriteIds` в `src/tasks/`

Сейчас она лежит в `Screens/logic/tasks/`. Теперь её вызывают старт (шаг 4) и вход (шаг 5), то есть два компонента, а значит, место ей в глобальной папке (4.4).

```ts
import { type ApiErrorCode, toApiErrorCode } from "../api/client";
import { fetchFavoriteIds } from "../api/favorites";
import { favoritesStore } from "../stores/FavoritesStore";
import { userStore } from "../stores/UserStore";
import { endSession } from "./endSession";

export interface LoadFavoriteIdsResult {
  error: ApiErrorCode | null;
}

/** Узнать, что в избранном у текущего пользователя: по id горят звёздочки и считается кнопка. */
export async function loadFavoriteIds(): Promise<LoadFavoriteIdsResult> {
  const email = userStore.email;
  favoritesStore.startLoading();
  try {
    const ids = await fetchFavoriteIds();
    // Пока ждали ответ, пользователь вышел или вошёл другой: ответ чужой.
    if (userStore.email !== email) return { error: null };
    favoritesStore.setIds(ids);
    return { error: null };
  } catch (error) {
    if (userStore.email !== email) return { error: null };
    const code = toApiErrorCode(error);
    if (code === "unauthorized") endSession();
    else favoritesStore.showError();
    return { error: code };
  }
}
```

Проверка `userStore.email !== email` защищает от гонки. Пользователь мог нажать «Выйти», пока шёл запрос. Без проверки пришедший ответ зажёг бы звёзды у гостя.

**Что сделать:**

- [ ] Создать `UserStore.ts`.
- [ ] Добавить `FavoritesStore.clear()`.
- [ ] Создать `src/tasks/endSession.ts`.
- [ ] Перенести `loadFavoriteIds.ts` в `src/tasks/`, а старый файл удалить.
- [ ] Поправить импорт в `Screens/logic/useFavoritesLoader.ts`.

**Как проверить.** Гость открывает приложение. Стартовая `loadFavoriteIds` получает 401 и вызывает `endSession()`. Кнопка «Избранное» показывает `0`, а не ошибку. До этого шага у гостя был `…` или ошибка.

**Коммит:** `add user store and end session task`.

---

## Шаг 3. Роутер и каналы по адресу

**Зачем.**

- В задании просят отдельную страницу входа.
- Звёздочке глубоко в дереве нужно отправить гостя на вход. Сейчас канал — это `useState` в Presenter'е `Screens`, и до него из `FavoriteStar` можно добраться только пробросом пропсов через 6 уровней.
- Пример `navigate("/login")` в ARCHITECTURE.md (7.5) уже рассчитан на роутер.

**Почему `HashRouter`.** GitHub Pages отдаёт `index.html` только для корня. Адрес `/TV_Shows_Explorer/favorites` после F5 дал бы 404. С `HashRouter` адреса выглядят как `/#/favorites`, и сервер Pages видит только корень.

### 3.1. Установка и подключение

```sh
npm install react-router
```

`src/main.tsx`:

```tsx
import { HashRouter } from "react-router";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </StrictMode>,
);
```

Провайдер ставим в `main.tsx`, а не в `App`: так `App` остаётся каркасом из одного `Screens` (8.12).

### 3.2. `Screens/logic/useChannel.ts` — новый хук

```ts
import { useLocation, useNavigate } from "react-router";

export type Channel = "search" | "favorites" | "login";

const CHANNEL_BY_PATH: Record<string, Channel> = {
  "/": "search",
  "/favorites": "favorites",
  "/login": "login",
};

/** Какой канал на экране, решает адрес. Неизвестный адрес — поиск. */
export function useChannel() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const channel = CHANNEL_BY_PATH[pathname] ?? "search";

  return {
    channel,
    // С поиска — в избранное, с любого другого канала — обратно к поиску.
    toggleFavorites: () => navigate(channel === "search" ? "/favorites" : "/"),
  };
}
```

### 3.3. `Screens/logic/usePresenter.ts`

`useState` заменяем на `useChannel`. View получает готовые флаги (8.4): сравнение `channel === …` делаем здесь, а не в JSX.

```ts
export function usePresenter() {
  useFavoritesLoader(); // на шаге 4 станет useSessionRestore
  const isWarmingUp = useWarmUp();
  const { channel, toggleFavorites } = useChannel();

  return {
    isWarmingUp,
    isSearchOpen: channel === "search",
    isFavoritesOpen: channel === "favorites",
    isLoginOpen: channel === "login",
    toggleFavorites,
  };
}
```

### 3.4. View: `Screens`, `ControlPanel`, `Footer`

`Screens.tsx`: тернарник превращается в три условия.

```tsx
<ControlPanel isFavoritesOpen={isFavoritesOpen} isLoginOpen={isLoginOpen} />
<TvScreen>
  {isSearchOpen && <SearchScreen isWarmingUp={isWarmingUp} />}
  {isFavoritesOpen && <FavoritesScreen />}
  {isLoginOpen && <LoginScreen />}
</TvScreen>
<Footer
  isSearchOpen={isSearchOpen}
  isFavoritesOpen={isFavoritesOpen}
  onToggleFavorites={toggleFavorites}
/>
```

`ControlPanel.tsx`: на канале входа вместо поиска показываем табличку «Вход», как сейчас делается для «Избранного».

`Footer.tsx`:

```tsx
{
  isSearchOpen && <SearchPagination />;
}
{
  isFavoritesOpen && <FavoritesPagination />;
}
<FavoritesButton isOpen={!isSearchOpen} onToggle={onToggleFavorites} />;
```

На канале входа пагинации нет, а кнопка показывает «← К поиску». Её Presenter не меняется: `isOpen` по-прежнему значит «мы не на поиске».

### 3.5. Заглушка `Screens/LoginScreen/LoginScreen.tsx`

Пока это просто текст «Здесь будет вход», без логики (8.5). Наполним на шаге 5.

**Что сделать:**

- [ ] `npm install react-router`.
- [ ] Добавить `HashRouter` в `main.tsx`.
- [ ] Создать `useChannel.ts` и поправить Presenter `Screens`.
- [ ] Обновить View `Screens`, `ControlPanel` и `Footer`.
- [ ] Создать заглушку `LoginScreen`.

**Как проверить:**

- кнопка «Избранное» переключает каналы, а в адресе меняется `#/` ↔ `#/favorites`;
- F5 на `#/favorites` открывает избранное;
- «Назад» в браузере возвращает на поиск;
- `#/login` показывает заглушку, а внизу кнопку «К поиску».

**Коммит:** `switch channels by url with hash router`.

---

## Шаг 4. Восстановление сессии при старте

**Зачем.** После F5 токен лежит в `localStorage`, но email в сторе пуст. Кроме того, токен мог умереть, если Render заснул. Значит, при старте надо спросить сервер, кто владелец токена.

### 4.1. `Screens/logic/tasks/restoreSession.ts` — новая задача

```ts
import { type ApiErrorCode, toApiErrorCode } from "../../../../api/client";
import { fetchMe, hasToken } from "../../../../api/auth";
import { userStore } from "../../../../stores/UserStore";
import { endSession } from "../../../../tasks/endSession";
import { loadFavoriteIds } from "../../../../tasks/loadFavoriteIds";

export interface RestoreSessionResult {
  error: ApiErrorCode | null;
}

/**
 * Узнать, кто пользуется приложением: вошёл ли он в прошлый раз и жива ли
 * его сессия. Если жива — сразу загружаем его избранное (7.8).
 */
export async function restoreSession(): Promise<RestoreSessionResult> {
  if (!hasToken()) {
    endSession();
    return { error: null };
  }

  try {
    const user = await fetchMe();
    userStore.setUser(user.email);
  } catch (error) {
    // 401: сервер забыл сессию, токен api/ уже стёр. Сеть: пускаем гостем,
    // токен остаётся, при следующем запуске попробуем снова.
    endSession();
    return { error: toApiErrorCode(error) };
  }
  return loadFavoriteIds();
}
```

Почему задача в `Screens/logic/tasks`, а не в глобальной папке: её вызывает только `Screens` (4.4).

Ждать `wakeUpServer` не нужно. Render просыпается от любого запроса, поэтому `/me` просто дольше ответит, а всё это время шапка показывает `…`.

### 4.2. `useFavoritesLoader` → `useSessionRestore`

```ts
import { useEffect } from "react";
import { restoreSession } from "./tasks/restoreSession";

/** Кто пользователь, нужно знать сразу: от этого зависят шапка, звёздочки и избранное. */
export function useSessionRestore() {
  useEffect(() => {
    restoreSession();
  }, []);
}
```

**Что сделать:**

- [ ] Создать `restoreSession.ts`.
- [ ] Переименовать файл и хук в `useSessionRestore` и поправить вызов в Presenter `Screens`.

**Как проверить:**

- Гость (в `localStorage` нет токена): во вкладке Network нет запроса `/api/favorites/ids` (DevTools → Network).
- Ручной вход через консоль: `postLogin` временно вызвать из `main.tsx`, как на шаге 1. После F5 должен уйти `/me`, затем `/ids`.
- Перезапусти `npm run dev:server` и нажми F5. `/me` отвечает 401, токен исчезает из `localStorage`, а кнопка «Избранное» показывает `0`.

**Коммит:** `restore session on start`.

---

## Шаг 5. Страница входа

**Зачем.** Это главное требование ДЗ: отдельная страница с одним полем email.

### 5.1. Структура

```text
Screens/LoginScreen/
├── LoginScreen.tsx
├── LoginScreen.module.css
└── logic/
    ├── usePresenter.ts
    ├── getLoginErrorText.ts
    └── tasks/
        └── login.ts
```

### 5.2. Задача `logic/tasks/login.ts`

```ts
import { type ApiErrorCode, toApiErrorCode } from "../../../../../api/client";
import { postLogin } from "../../../../../api/auth";
import { userStore } from "../../../../../stores/UserStore";
import { loadFavoriteIds } from "../../../../../tasks/loadFavoriteIds";

/** invalid-email — сценарный код: в языке входа «плохой запрос» означает «плохой email». */
export type LoginErrorCode = ApiErrorCode | "invalid-email";

export interface LoginResult {
  error: LoginErrorCode | null;
}

/** Войти по email и загрузить избранное этого пользователя. */
export async function login(email: string): Promise<LoginResult> {
  try {
    const user = await postLogin(email);
    userStore.setUser(user.email);
  } catch (error) {
    const code = toApiErrorCode(error);
    return { error: code === "bad-request" ? "invalid-email" : code };
  }
  // Не ждём: вход уже состоялся, а звёзды загорятся, когда придёт ответ.
  loadFavoriteIds();
  return { error: null };
}
```

Почему email не проверяем на клиенте регуляркой: это бизнес-правило, и живёт оно на сервере (9.1). На клиенте достаточно `type="email"` у поля и неактивной кнопки при пустом вводе.

### 5.3. `logic/getLoginErrorText.ts`

```ts
import type { LoginErrorCode } from "./tasks/login";

const ERROR_TEXT: Record<LoginErrorCode, string> = {
  "invalid-email": "Похоже, в адресе опечатка. Проверьте email.",
  network: "Не удалось связаться с сервером. Проверьте интернет.",
  "rate-limit": "Слишком много попыток. Подождите немного.",
  server: "Сервер вернул ошибку. Попробуйте ещё раз.",
  unauthorized: "Не удалось войти. Попробуйте ещё раз.",
  "bad-request": "Похоже, в адресе опечатка. Проверьте email.",
};

export function getLoginErrorText(code: LoginErrorCode): string {
  return ERROR_TEXT[code];
}
```

### 5.4. `logic/usePresenter.ts`

```ts
import { type ChangeEvent, type FormEvent, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { getLoginErrorText } from "./getLoginErrorText";
import { type LoginErrorCode, login } from "./tasks/login";

export function usePresenter() {
  // Ввод, ожидание и ошибка нужны только этой форме — локальное состояние (7.5).
  const [email, setEmail] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<LoginErrorCode | null>(null);
  const navigate = useNavigate();
  // Откуда пришли на вход: туда и вернёмся (например, в избранное).
  const from = (useLocation().state as { from?: string } | null)?.from ?? "/";

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isPending) return;
    setIsPending(true);
    setError(null);
    const result = await login(email);
    setIsPending(false);

    if (result.error) return setError(result.error);
    navigate(from, { replace: true });
  };

  return {
    email,
    handleEmailChange: (event: ChangeEvent<HTMLInputElement>) =>
      setEmail(event.target.value),
    isSubmitDisabled: isPending || email.trim() === "",
    submitLabel: isPending ? "Входим…" : "Войти",
    hasError: error !== null,
    errorText: error ? getLoginErrorText(error) : "",
    handleSubmit,
  };
}
```

`replace: true` убирает `/login` из истории, чтобы «Назад» после входа не возвращал на форму.

### 5.5. View `LoginScreen.tsx`

Внутри только JSX:

- `<form onSubmit={handleSubmit}>`;
- `<label>` и `<input type="email" autoComplete="email" required value onChange>`;
- кнопка `type="submit" disabled={isSubmitDisabled}`;
- `{hasError && <p role="alert">{errorText}</p>}`.

Стиль в духе телевизора (моноширинный шрифт, как в `NoSignal`/`IdleMessage`) — на твоё усмотрение.

**Что сделать:**

- [ ] Создать задачу `login.ts`.
- [ ] Создать `getLoginErrorText.ts`.
- [ ] Написать Presenter.
- [ ] Заменить заглушку на форму и добавить стили.

**Как проверить:**

- `#/login`: при пустом поле кнопка неактивна;
- `abc@` → браузер не даст отправить (`type="email"`);
- `abc@x` пройдёт проверку браузера, а сервер ответит 400, и форма покажет «опечатка»;
- `a@x.ru` перенаправляет на `/`, а кнопка «Избранное» показывает число.

**Коммит:** `add login screen`.

---

## Шаг 6. Email и «Выйти» в шапке

**Зачем.** Требования ДЗ: «после входа отображайте email» и «предусмотрите Logout».

### 6.1. Структура

```text
Header/
├── Header.tsx              ← добавить <UserBadge />, логики у Header нет
└── UserBadge/
    ├── UserBadge.tsx
    ├── UserBadge.module.css
    └── logic/
        ├── usePresenter.ts
        └── tasks/
            └── logout.ts
```

### 6.2. Задача `logout.ts`

```ts
import { postLogout } from "../../../../../../api/auth";
import { endSession } from "../../../../../../tasks/endSession";

/**
 * Выйти. Интерфейс очищаем сразу (optimistic UI). Сервер уведомляем после:
 * токен для этого запроса api/ ещё помнит. Если сервер недоступен или уже
 * забыл сессию, локально пользователь всё равно вышел — ошибки нет.
 */
export async function logout(): Promise<void> {
  endSession();
  try {
    await postLogout();
  } catch {
    // Выход на сервере идемпотентен, повторять незачем: токен api/ уже стёр.
  }
}
```

Отката здесь нет, в отличие от 7.9. Пользователь, нажавший «Выйти», не должен остаться внутри из-за сбоя сети.

### 6.3. `logic/usePresenter.ts`

```ts
import { useNavigate } from "react-router";
import { userStore } from "../../../../../stores/UserStore";
import { logout } from "./tasks/logout";

export function usePresenter() {
  const navigate = useNavigate();
  const { status, email } = userStore;

  return {
    isChecking: status === "checking",
    isGuest: status === "guest",
    isAuthorized: status === "authorized",
    email: email ?? "",
    handleLogin: () => navigate("/login"),
    handleLogout: logout,
  };
}
```

После выхода не переходим на другую страницу: на `/favorites` гость увидит приглашение войти (шаг 7), на поиске просто погаснут звёзды.

### 6.4. View `UserBadge.tsx`

Компонент обёрнут в `observer`.

- `{isChecking && <span>…</span>}`
- `{isGuest && <button onClick={handleLogin}>Войти</button>}`
- `{isAuthorized && (<><span>{email}</span><button onClick={handleLogout}>Выйти</button></>)}`

Длинный email обрезаем в CSS (`text-overflow: ellipsis`) и показываем целиком в `title`.

**Что сделать:**

- [ ] Создать задачу `logout.ts`.
- [ ] Написать Presenter и View `UserBadge`.
- [ ] Вставить `<UserBadge />` в `Header.tsx` и поправить сетку в `Header.module.css`.

**Как проверить:**

- гость видит «Войти», а кнопка ведёт на `#/login`;
- после входа в шапке виден email, «Выйти» сразу гасит звёзды, и кнопка показывает `0`;
- после F5 пользователь по-прежнему гость;
- во вкладке Network `POST /api/auth/logout` отправлен с заголовком `Authorization`.

**Коммит:** `show user email and logout in header`.

---

## Шаг 7. Ограничения для гостя

**Зачем.** Требование ДЗ: гость ищет и смотрит, но не добавляет в избранное. Сервер не пустит его и так (401), но интерфейс должен это объяснить до клика, а не после ошибки.

### 7.1. `FavoriteStar/logic/usePresenter.ts`

```ts
const navigate = useNavigate();
const isAuthorized = userStore.isAuthorized;

const handleClick = async () => {
  // Гостя ведём на вход. Это навигация, поэтому она в Presenter, а не в задаче (1.6).
  if (!isAuthorized) return navigate("/login");
  // ...дальше как сейчас
};

label: !isAuthorized
  ? `Войдите, чтобы добавить «${show.name}» в избранное`
  : isFavorite ? ... : ...,
```

Задачу `toggleFavorite` не трогаем: решение «пускать или вести на вход» принимает интерфейс.

### 7.2. `FavoritesButton/logic/usePresenter.ts`

```ts
const isGuest = userStore.status === "guest";
// У гостя избранного нет — нет и счётчика.
hasCount: !isOpen && !isGuest,
```

Клик ведёт в `/favorites` как обычно: там гость увидит приглашение (7.3).

### 7.3. Приглашение войти на экране избранного

```text
FavoritesScreen/
└── LoginPrompt/
    ├── LoginPrompt.tsx       — «Избранное доступно после входа» + кнопка «Войти»
    └── logic/usePresenter.ts — handleLogin: navigate("/login", { state: { from: "/favorites" } })
```

Компонент нужен только экрану избранного, поэтому лежит в его папке (3.3).

`FavoritesScreen/logic/usePresenter.ts`:

```ts
const isGuest = userStore.status === "guest";

return {
  isGuest,
  isLoading: !isGuest && status === "loading",
  isError: !isGuest && status === "error",
  isEmpty: !isGuest && isReady && result.shows.length === 0,
  hasShows: !isGuest && isReady && result.shows.length > 0,
  // ...
};
```

View: `{isGuest && <LoginPrompt />}`.

`FavoritesScreen/logic/tasks/openFavorites.ts`: гостю незачем ходить на сервер.

```ts
if (userStore.status === "guest") return Promise.resolve({ error: null });
```

Почему не перенаправлять гостя сразу на `/login`: после «Выйти» на канале избранного или после 401 случились бы два перехода подряд. Приглашение проще и понятнее: пользователь видит, где он и что произошло.

**Что сделать:**

- [ ] Ограничить звёздочку для гостя: подпись и переход на вход.
- [ ] Скрыть у гостя счётчик на кнопке «Избранное».
- [ ] Создать `LoginPrompt` и вставить его в `FavoritesScreen`.
- [ ] Добавить проверку на гостя в `openFavorites`.

**Как проверить:**

- гость наводит курсор на звёздочку и видит подсказку «Войдите…», а клик открывает `#/login`;
- после входа пользователь возвращается на поиск;
- гость на «Избранном» видит приглашение, «Войти» открывает форму, а после входа возвращает в избранное;
- запроса `/api/favorites` у гостя нет.

**Коммит:** `restrict favorites for guests`.

---

## Шаг 8. Ответ 401 посреди работы

**Зачем.** Это нюанс с сервером. Пользователь вошёл, Render заснул или перезапустился, и пользователь кликает звёздочку. Сервер отвечает 401, и клиент должен вежливо разлогинить, а не показывать «Сбой».

### 8.1. `toggleFavorite.ts`

В обеих ветках `catch` после отката:

```ts
const code = toApiErrorCode(error);
favoritesStore.remove(show.id); // откат, как сейчас
if (code === "unauthorized") endSession();
return { error: code };
```

### 8.2. `src/tasks/loadFavoritesPage.ts`

```ts
const code = toApiErrorCode(error);
if (code === "unauthorized") {
  endSession(); // экран избранного сам покажет приглашение войти
  return { error: code };
}
favoritesPageStore.showError(code);
return { error: code };
```

Отдельный тост на экране избранного не нужен: экран сам сменится на `LoginPrompt`.

### 8.3. Тост «Сессия истекла»

`ToastStore.ts`:

```ts
export type ToastKind =
  | "favorite-added"
  | "favorite-removed"
  | "favorite-error"
  | "session-expired";

// Не у каждого уведомления есть сериал.
show(kind: ToastKind, showName = "") { ... }
```

`Toast/logic/getToastText.ts`: добавить `case "session-expired": return "Сессия истекла. Войдите снова.";`.

`Toast/logic/usePresenter.ts`: это тоже сбой, поэтому `isError` учитывает оба вида.

```ts
const isError =
  toast?.kind === "favorite-error" || toast?.kind === "session-expired";
```

### 8.4. `FavoriteStar/logic/usePresenter.ts` — реакция на результат

```ts
const result = await toggleFavorite(show);
setIsPending(false);

if (result.error === "unauthorized") {
  toastStore.show("session-expired");
  return navigate("/login");
}
if (result.error) return toastStore.show("favorite-error", show.name);
```

Если Presenter перерастёт 120 строк или станет трудно читаться, вынеси реакцию на результат в хук `useToggleFavorite` по правилу 1.3.

**Что сделать:**

- [ ] Обработать 401 в `toggleFavorite`.
- [ ] Обработать 401 в `loadFavoritesPage`.
- [ ] Добавить в `ToastStore` вид `session-expired` и необязательный `showName`.
- [ ] Обновить `getToastText` и `isError` в Presenter'е `Toast`.
- [ ] В Presenter'е звёздочки показывать тост и вести на `/login`.

**Как проверить** (главный сценарий из нюанса):

1. Войти, добавить шоу в избранное.
2. Перезапустить сервер: `Ctrl+C` и `npm run dev:server`.
3. Кликнуть другую звёздочку. Звёздочка откатывается, появляется тост «Сессия истекла», открывается `#/login`, в шапке «Войти», а токена в `localStorage` нет.
4. Войти снова под тем же email. Избранное будет пустым: сервер в памяти всё потерял (9.7). Это ожидаемо.
5. Повторить пункты 1–2, затем открыть «Избранное» и перелистнуть страницу. Должно появиться приглашение войти, а не «Нет сигнала».

**Коммит:** `handle expired session`.

---

## Шаг 9. ARCHITECTURE.md

**Зачем.** CLAUDE.md требует фиксировать новые правила. Решения этого ДЗ не очевидны из конспекта.

Черновик пунктов для раздела 8:

- **8.13. Токен — деталь транспорта.** Он живёт в `api/token.ts`, `request` сам подставляет заголовок и сам стирает токен на 401. Задачи и сторы токена не видят: вход для задачи — это «email на входе, email на выходе». _Почему:_ правило 7.6. Если поменяем `localStorage` на cookie, изменится только `api/`.
- **8.14. Текущий пользователь хранится в `userStore`:** email и статус `checking | guest | authorized`. Это пример глобальных данных из конспекта 3: их читают шапка, звёздочки, кнопка и экран избранного.
- **8.15. Ответ 401 — явный вызов, а не реакция.** Задача, получившая `unauthorized`, сама вызывает `endSession()`. `api/` о сторах не знает (1.7), а подписка на 401 была бы реакцией, которую запрещает 7.8. Что показать (тост, переход на вход), решает Presenter по результату.
- **8.16. Канал определяется адресом.** Используем `HashRouter` (GitHub Pages не умеет SPA-fallback), а провайдер подключаем в `main.tsx`, чтобы не трогать `App` (8.12). `useNavigate` и `useLocation` вызывает только Presenter.
- **8.17. Гостя не перенаправляем автоматически.** Экран, недоступный гостю, показывает приглашение войти. Переход на вход делает только явное действие пользователя.

Ещё:

- [ ] В 8.8, если `src/utils/` осталась (шаг 1.1), описать её или убрать.
- [ ] README: при необходимости упомянуть адреса `#/login` и `#/favorites`.
- [ ] `npm run check:fix`, потому что Biome форматирует и `.md`.

**Коммит:** `document auth rules in architecture`.

---

## Шаг 10. Ручная проверка и PR

### Сценарии из ДЗ

- [ ] Гость ищет и смотрит сериалы.
- [ ] Гость не может добавить в избранное: звёздочка ведёт на вход.
- [ ] Отдельная страница входа с одним полем email.
- [ ] После входа виден email.
- [ ] «Выйти» работает.
- [ ] Вход как `a@x.ru` → добавить 2 шоу → выйти → войти как `b@x.ru`: избранное пусто → выйти → войти как `A@x.ru`: видны те же 2 шоу.
- [ ] После F5 пользователь остаётся залогиненным.

### Нюанс с сервером

- [ ] Перезапуск сервера → клик по звёздочке → тост, вход, «Войти» в шапке.
- [ ] Перезапуск сервера → F5 → тихо гость, токена в `localStorage` нет.
- [ ] Перезапуск сервера → листание избранного → приглашение войти.

### Технические проверки

- [ ] `npm run check`.
- [ ] `npm run build`.
- [ ] `npm run typecheck:server`.
- [ ] Ни один файл кода не длиннее 120 строк (`npm run check` это ловит).
- [ ] Нет циклов импортов: `api/` не импортирует `tasks/` и `stores/`, `stores/` не импортирует `tasks/`.

### PR

Ветка `lesson-3` уже содержит сервер (`fb90660`) и шаг 1 (`4e09fcc`). Предлагаю один PR на всё ДЗ: `/finish-task`, заголовок `add email auth and per-user favorites`, описание на русском. После деплоя проверить, что на Render задана переменная `CORS_ORIGIN` с доменом Pages и что `Authorization` проходит CORS: пакет `cors` по умолчанию разрешает заголовки, которые запросил браузер.

Мои вопросы по плану:

- Пункт 3 на проверке там уже должна быть кнопка к поимку, но ее нет, возможно она будет в следующих шагах
- Пункт 4 проверку не делал руками, жду пока все заработает из интерфейса
