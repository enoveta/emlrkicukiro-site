#!/usr/bin/env bash
# Deploy a new release to https://site.emlrkicukiroparish.org (staging). Run from the project root on your computer:
#   ./deploy/staging/deploy.sh            # build, upload, migrate, switch, restart, health-check
#   ./deploy/staging/deploy.sh --media    # also sync Backend/public/media (first deploy)
# Uses the "emlrkicukiro" host from ~/.ssh/config. No secrets are read or printed here.
set -euo pipefail
HOST=emlrkicukiro
APP=/var/www/site.emlrkicukiroparish.org
SITE=https://site.emlrkicukiroparish.org
REL=$(date +%Y%m%d%H%M%S)
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
SSH="ssh -o BatchMode=yes $HOST"
step() { echo; echo "==> $*"; }

cd "$ROOT"
step "Build frontend (content snapshot from the live API when reachable)"
SNAPSHOT_API="${SNAPSHOT_API:-$SITE}" SITE_URL="$SITE" REACT_APP_API_URL= npm run build >/tmp/emlr-build.log 2>&1 || { tail -30 /tmp/emlr-build.log; exit 1; }
step "Build API"
(cd Backend && npm run build >/dev/null)

step "Upload release $REL"
$SSH "mkdir -p $APP/releases/$REL"
tar -czf - build Backend/dist Backend/src Backend/prisma Backend/prisma.config.ts Backend/package.json Backend/package-lock.json Backend/tsconfig.json \
  | $SSH "tar -xzf - -C $APP/releases/$REL"
if [[ "${1:-}" == "--media" ]]; then
  step "Sync media"
  rsync -az --exclude uploads Backend/public/media/ "$HOST:$APP/shared/media/"
fi

step "Install API dependencies and link shared files"
$SSH "set -e; cd $APP/releases/$REL/Backend
  npm ci --no-audit --no-fund --loglevel=error
  DATABASE_URL=postgresql://build@127.0.0.1/build npx --no-install prisma generate >/dev/null
  mkdir -p public && ln -sfn $APP/shared/media public/media
  ln -sfn $APP/shared/.env .env
  chmod -R g+rwX,o+rX $APP/releases/$REL"

# $APP/current is a fixed root-owned link to releases/current; we switch only releases/current.
PREV=$($SSH "readlink $APP/releases/current 2>/dev/null || true")
step "Switch releases/current -> $REL"
$SSH "cd $APP/releases && ln -sfn $REL current.tmp && mv -Tf current.tmp current"

rollback() {
  echo "!! Deploy failed; switching back to ${PREV:-<none>}"
  [[ -n "$PREV" ]] && $SSH "cd $APP/releases && ln -sfn $PREV current.tmp && mv -Tf current.tmp current && sudo /usr/local/sbin/emlr-site-ctl restart" || true
  exit 1
}
trap rollback ERR

step "Pending migrations"
$SSH "sudo /usr/local/sbin/emlr-site-ctl migrate-status" || true
step "Apply migrations"
$SSH "sudo /usr/local/sbin/emlr-site-ctl migrate"
step "Restart API"
$SSH "sudo /usr/local/sbin/emlr-site-ctl restart"
step "Health check"
for i in 1 2 3 4 5; do
  if $SSH "curl -fsS --max-time 5 http://127.0.0.1:5050/health" >/dev/null; then echo "   API healthy"; break; fi
  [[ $i == 5 ]] && false
  sleep 3
done
trap - ERR

step "Keep the 5 newest releases"
$SSH "cd $APP/releases && ls -1dt 2*/ | tail -n +6 | xargs -r rm -rf"
echo; echo "Deployed release $REL to $SITE"
