/** Ответы TVmaze в памяти процесса. Срок жизни записи проверяет задача, а не хранилище (9.4). */
interface CacheEntry {
  data: unknown;
  savedAt: number;
}

const cache: Record<string, CacheEntry> = {};

export function readCache(key: string): CacheEntry | undefined {
  return cache[key];
}

export function writeCache(key: string, data: unknown, savedAt: number) {
  cache[key] = { data, savedAt };
}
