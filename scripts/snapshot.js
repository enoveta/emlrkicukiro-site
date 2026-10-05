/**
 * Saves the public website content into src/data/snapshot.json before each build.
 * The site shows this copy instantly and falls back to it whenever the API is unreachable.
 *
 *   SNAPSHOT_API=https://emlrkicukiro.rw npm run snapshot
 *
 * If the API cannot be reached, the existing snapshot is kept and the build continues.
 */
const fs = require('fs');
const path = require('path');

const API = (process.env.SNAPSHOT_API || process.env.REACT_APP_API_URL || 'http://localhost:5050').replace(/\/$/, '');
const OUT = path.join(__dirname, '..', 'src', 'data', 'snapshot.json');
const PATHS = [
  '/settings',
  '/banners',
  '/stats',
  '/ministries',
  '/announcements',
  '/events',
  '/notices',
  '/schedule',
  '/people',
  '/gallery',
  '/testimonials',
  '/giving',
];
const DROP = new Set(['createdById', 'publishedById', 'status', 'createdAt', 'bannerId']);

const strip = (value) => {
  if (Array.isArray(value)) return value.map(strip);
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([k, v]) => !DROP.has(k) && v !== null && v !== '')
        .map(([k, v]) => [k, strip(v)])
    );
  }
  return value;
};

(async () => {
  const result = {};
  try {
    for (const p of PATHS) {
      const res = await fetch(`${API}/api/public${p}`, { signal: AbortSignal.timeout(10000) });
      if (!res.ok) throw new Error(`${p} -> HTTP ${res.status}`);
      result[p] = strip(await res.json());
    }
  } catch (err) {
    console.warn(`[snapshot] API not reachable at ${API} (${err.message}); keeping existing snapshot.`);
    if (!fs.existsSync(OUT)) fs.writeFileSync(OUT, '{}\n');
    return;
  }
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, `${JSON.stringify(result)}\n`);
  console.log(`[snapshot] saved ${PATHS.length} endpoints (${(fs.statSync(OUT).size / 1024).toFixed(1)} KB) from ${API}`);
})();
