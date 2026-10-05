#!/usr/bin/env bash
# Update the live site after `git pull`. Run on the VPS from /var/www/emlr.
set -euo pipefail
cd /var/www/emlr

echo "→ Backend"
cd Backend
npm ci
npx prisma migrate deploy
npx prisma generate
npm run build
pm2 reload emlr-api || pm2 start ../deploy/ecosystem.config.js
cd ..

echo "→ Frontend (snapshot of live content is bundled for offline fallback)"
npm ci
SNAPSHOT_API=http://127.0.0.1:5050 SITE_URL="${SITE_URL:-https://emlrkicukiro.rw}" npm run build

echo "✓ Deployed"
