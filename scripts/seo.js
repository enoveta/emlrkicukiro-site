/**
 * Writes public/robots.txt and public/sitemap.xml for the production domain.
 *   SITE_URL=https://emlrkicukiroparish.org npm run build
 */
const fs = require('fs');
const path = require('path');

const SITE = (process.env.SITE_URL || 'https://emlrkicukiroparish.org').replace(/\/$/, '');
const PUBLIC = path.join(__dirname, '..', 'public');
const snapshot = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'src', 'data', 'snapshot.json'), 'utf8') || '{}');

const pages = [
  '/',
  '/about',
  '/about/mission-vision',
  '/about/leadership',
  '/about/team',
  '/about/location',
  '/ministries',
  '/events',
  '/amatangazo',
  '/news',
  '/gallery',
  '/tv',
  '/give',
  '/prayer-requests',
  '/volunteer',
  '/privacy-policy',
  '/terms-of-service',
  ...(snapshot['/ministries'] || []).map((m) => `/ministries/${m.slug}`),
  ...(snapshot['/announcements'] || []).map((n) => `/news/${n.id}`),
];

const today = new Date().toISOString().slice(0, 10);
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map((p) => `  <url><loc>${SITE}${p}</loc><lastmod>${today}</lastmod></url>`).join('\n')}
</urlset>
`;

fs.writeFileSync(path.join(PUBLIC, 'sitemap.xml'), xml);
fs.writeFileSync(
  path.join(PUBLIC, 'robots.txt'),
  `User-agent: *\nAllow: /\nDisallow: /admin\n\nSitemap: ${SITE}/sitemap.xml\n`
);
console.log(`[seo] sitemap.xml (${pages.length} URLs) and robots.txt written for ${SITE}`);
