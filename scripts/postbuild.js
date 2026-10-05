/**
 * After the build: tell the browser about the first hero image straight from index.html,
 * so it downloads in parallel with the JavaScript (faster first paint on phones).
 */
const fs = require('fs');
const path = require('path');

const html = path.join(__dirname, '..', 'build', 'index.html');
const snapshot = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'src', 'data', 'snapshot.json'), 'utf8') || '{}');
const first = snapshot['/banners']?.[0]?.slides?.[0];

if (first?.imageUrl && first.mediaType !== 'video' && fs.existsSync(html)) {
  const tag = `<link rel="preload" as="image" href="${first.imageUrl}" fetchpriority="high">`;
  const page = fs.readFileSync(html, 'utf8');
  if (!page.includes(tag)) fs.writeFileSync(html, page.replace('</head>', `${tag}</head>`));
  console.log(`[postbuild] preloading hero image ${first.imageUrl}`);
}
