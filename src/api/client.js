// In production the site and API share one domain (nginx proxies /api and /media),
// so REACT_APP_API_URL is empty and every request is same-origin.
const API_BASE = (process.env.REACT_APP_API_URL || '').replace(/\/$/, '');

const cache = new Map();
const CACHE_TTL = 15_000;

export const mediaUrl = (path) => {
  if (!path) return '';
  if (/^(https?:|blob:|data:)/.test(path)) return path;
  return `${API_BASE}${path.startsWith('/') ? path : `/${path}`}`;
};

/** Card-sized copy of an optimized image (name-800.webp), or the original when none exists. */
export const mediaThumb = (path) => {
  const url = mediaUrl(path);
  return /\/media\/.+\.webp$/i.test(url) && !/-800\.webp$/i.test(url)
    ? url.replace(/\.webp$/i, '-800.webp')
    : url;
};

export const invalidateAdminCache = (prefix = '') => {
  for (const key of cache.keys()) {
    if (!prefix || key.includes(prefix)) cache.delete(key);
  }
};

async function request(path, options = {}) {
  const { cache: cacheOpt, auth = true, ...fetchOptions } = options;
  const method = (fetchOptions.method || 'GET').toUpperCase();
  const useCache = method === 'GET' && cacheOpt !== false;
  const cacheKey = `${method}:${path}`;

  if (useCache && cache.has(cacheKey)) {
    const hit = cache.get(cacheKey);
    if (Date.now() - hit.at < CACHE_TTL) return hit.data;
  }

  const headers = {
    ...(fetchOptions.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
    ...(fetchOptions.headers || {}),
  };
  if (auth) {
    let token = null;
    try {
      token = localStorage.getItem('emlr_token');
    } catch {
      /* storage blocked */
    }
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, { ...fetchOptions, headers });

  if (res.status === 401 && auth && path.startsWith('/api/') && !path.startsWith('/api/public')) {
    try {
      localStorage.removeItem('emlr_token');
    } catch {
      /* ignore */
    }
  }

  if (res.status === 204) {
    if (method !== 'GET') invalidateAdminCache();
    return null;
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const error = new Error(data?.message || data?.error || `Request failed (${res.status})`);
    error.status = res.status;
    throw error;
  }

  if (useCache) cache.set(cacheKey, { at: Date.now(), data });
  if (method !== 'GET') invalidateAdminCache();
  return data;
}

export const publicApi = {
  get: (path) => request(`/api/public${path}`, { cache: false, auth: false }),
  post: (path, body) =>
    request(`/api/public${path}`, { method: 'POST', body: JSON.stringify(body), auth: false }),
};

export const adminApi = {
  get: (path, opts) => request(`/api${path}`, opts),
  post: (path, body) => request(`/api${path}`, { method: 'POST', body: JSON.stringify(body) }),
  put: (path, body) => request(`/api${path}`, { method: 'PUT', body: JSON.stringify(body) }),
  patch: (path, body) => request(`/api${path}`, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: (path) => request(`/api${path}`, { method: 'DELETE' }),
  upload: async (file) => {
    const form = new FormData();
    form.append('file', file);
    return request('/api/uploads', { method: 'POST', body: form });
  },
  uploadMany: async (files) => {
    const form = new FormData();
    [...files].forEach((file) => form.append('files', file));
    return request('/api/uploads/many', { method: 'POST', body: form });
  },
  listMedia: () => request('/api/uploads', { cache: false }),
  deleteMedia: (url) => request(`/api/uploads?url=${encodeURIComponent(url)}`, { method: 'DELETE' }),
  login: (email, password) =>
    request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      auth: false,
    }),
};

export default API_BASE;
