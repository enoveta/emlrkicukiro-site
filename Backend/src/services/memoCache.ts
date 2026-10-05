type Entry<T> = { at: number; value: T };

const store = new Map<string, Entry<unknown>>();

/** Small in-process TTL cache. On loader failure, serves the last good value if one exists. */
export async function memo<T>(key: string, ttlMs: number, loader: () => Promise<T>): Promise<T> {
  const hit = store.get(key) as Entry<T> | undefined;
  if (hit && Date.now() - hit.at < ttlMs) return hit.value;
  try {
    const value = await loader();
    store.set(key, { at: Date.now(), value });
    return value;
  } catch (err) {
    if (hit) return hit.value;
    throw err;
  }
}

export function clearMemo(prefix = "") {
  for (const key of store.keys()) if (key.startsWith(prefix)) store.delete(key);
}
