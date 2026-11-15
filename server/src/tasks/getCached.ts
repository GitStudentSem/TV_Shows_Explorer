import { readCache, writeCache } from "../storage/cache.ts";

/** Одинаковый запрос к TVmaze в течение 5 минут отдаём из кеша. */
export const CACHE_TTL_MS = 5 * 60 * 1000;

/**
 * Взять данные из кеша, а если их нет или они устарели, загрузить и обновить кеш.
 * Ошибку загрузки не кешируем: следующий запрос попробует снова.
 */
export async function getCached<T>(
  key: string,
  load: () => Promise<T>,
): Promise<T> {
  const now = Date.now();
  const entry = readCache(key);

  if (entry && now - entry.savedAt < CACHE_TTL_MS) {
    console.log(`cache hit  ${key}`);
    return entry.data as T;
  }

  console.log(`cache miss ${key}`);
  const data = await load();
  writeCache(key, data, now);
  return data;
}
