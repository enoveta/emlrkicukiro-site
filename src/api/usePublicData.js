import { useCallback, useEffect, useSyncExternalStore } from 'react';
import { publicApi } from './client';
import snapshot from '../data/snapshot.json';

/*
 * Public content store — stale-while-revalidate with three fallbacks, so pages render
 * instantly and keep showing content when the API is slow or down:
 *   1. in-memory (shared by every component, one request per path)
 *   2. localStorage copy from this visitor's last successful load
 *   3. snapshot.json bundled into the site at build time
 */

const STORAGE_PREFIX = 'emlr_pub:';
const REVALIDATE_AFTER = 60_000;

const entries = new Map(); // path -> { data, fetchedAt, error, promise }
const listeners = new Map(); // path -> Set<fn>

const readStored = (path) => {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + path);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const writeStored = (path, data) => {
  try {
    localStorage.setItem(STORAGE_PREFIX + path, JSON.stringify({ data, at: Date.now() }));
  } catch {
    /* quota or blocked storage: memory + snapshot still work */
  }
};

const notify = (path) => listeners.get(path)?.forEach((fn) => fn());

const getEntry = (path) => {
  let entry = entries.get(path);
  if (!entry) {
    const stored = readStored(path);
    const fallback = stored?.data ?? snapshot[path];
    entry = { data: fallback, fetchedAt: 0, error: null, promise: null, hasData: fallback !== undefined };
    entries.set(path, entry);
  }
  return entry;
};

export function loadPublic(path, { force = false } = {}) {
  const entry = getEntry(path);
  if (entry.promise) return entry.promise;
  if (!force && entry.fetchedAt && Date.now() - entry.fetchedAt < REVALIDATE_AFTER) {
    return Promise.resolve(entry.data);
  }
  entry.promise = publicApi
    .get(path)
    .then((data) => {
      entries.set(path, { data, fetchedAt: Date.now(), error: null, promise: null, hasData: true });
      writeStored(path, data);
      return data;
    })
    .catch((err) => {
      // Keep whatever we were already showing; only record the error.
      entries.set(path, { ...entry, promise: null, error: err, fetchedAt: Date.now() });
      return entry.data;
    })
    .finally(() => notify(path));
  return entry.promise;
}

const subscribe = (path, fn) => {
  if (!listeners.has(path)) listeners.set(path, new Set());
  listeners.get(path).add(fn);
  return () => listeners.get(path).delete(fn);
};

/**
 * @returns {{ data: any, loading: boolean, error: Error|null }}
 * `loading` is true only when there is nothing at all to show yet.
 */
export function usePublicData(path, initialValue = []) {
  const sub = useCallback((fn) => subscribe(path, fn), [path]);
  const entry = useSyncExternalStore(sub, () => getEntry(path));

  useEffect(() => {
    if (path) loadPublic(path);
  }, [path]);

  const hasData = entry.hasData && entry.data !== undefined && entry.data !== null;
  return {
    data: hasData ? entry.data : initialValue,
    loading: !hasData && !entry.error,
    error: hasData ? null : entry.error,
  };
}

/** Site settings with safe defaults so contact details are never blank. */
export function useSettings() {
  const { data } = usePublicData('/settings', {});
  return data || {};
}
