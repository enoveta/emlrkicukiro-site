const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5050';

const cache = new Map();
const CACHE_TTL = 15_000;

export const mediaUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('blob:')) {
    return path;
  }
  return `${API_BASE}${path.startsWith('/') ? path : `/${path}`}`;
};

export const invalidateAdminCache = (prefix = '') => {
  for (const key of cache.keys()) {
    if (!prefix || key.includes(prefix)) cache.delete(key);
  }
};

async function request(path, options = {}) {
  const { cache: cacheOpt, ...fetchOptions } = options;
  const method = (fetchOptions.method || 'GET').toUpperCase();
  const useCache = method === 'GET' && cacheOpt !== false;
  const cacheKey = `${method}:${path}`;

  if (useCache && cache.has(cacheKey)) {
    const hit = cache.get(cacheKey);
    if (Date.now() - hit.at < CACHE_TTL) return hit.data;
  }

  const token = localStorage.getItem('emlr_token');
  const headers = {
    ...(fetchOptions.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
    ...(fetchOptions.headers || {}),
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, {
    ...fetchOptions,
    headers,
  });

  if (res.status === 204) {
    if (method !== 'GET') invalidateAdminCache();
    return null;
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message = data?.message || data?.error || `Request failed (${res.status})`;
    throw new Error(message);
  }

  if (useCache) cache.set(cacheKey, { at: Date.now(), data });
  if (method !== 'GET') invalidateAdminCache();
  return data;
}

export const publicApi = {
  get: (path) => request(`/api/public${path}`),
  post: (path, body) =>
    request(`/api/public${path}`, { method: 'POST', body: JSON.stringify(body) }),
};

export const adminApi = {
  get: (path, opts) => request(`/api${path}`, opts),
  post: (path, body) =>
    request(`/api${path}`, { method: 'POST', body: JSON.stringify(body) }),
  put: (path, body) =>
    request(`/api${path}`, { method: 'PUT', body: JSON.stringify(body) }),
  patch: (path, body) =>
    request(`/api${path}`, { method: 'PATCH', body: JSON.stringify(body) }),
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
    }),
};

export const formatEventDay = (dateStr) => {
  const d = new Date(dateStr);
  return String(d.getUTCDate()).padStart(2, '0');
};

export const formatEventMonth = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleString('en-US', { month: 'short', timeZone: 'UTC' }).toUpperCase();
};

export const formatNewsDate = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  });
};

export default API_BASE;
