#!/usr/bin/env bash
# Switch https://site.emlrkicukiroparish.org back to the previous release and restart the API.
#   ./deploy/staging/rollback.sh
# Note: database migrations are not reversed automatically (they only add columns/tables).
set -euo pipefail
HOST=emlrkicukiro
APP=/var/www/site.emlrkicukiroparish.org
SSH="ssh -o BatchMode=yes $HOST"
CUR=$($SSH "readlink $APP/releases/current")
PREV=$($SSH "cd $APP/releases && ls -1dt 2*/ | tr -d / | grep -vx '$CUR' | head -1")
[[ -n "$PREV" ]] || { echo "No previous release to roll back to"; exit 1; }
echo "Rolling back: $CUR -> $PREV"
$SSH "cd $APP/releases && ln -sfn $PREV current.tmp && mv -Tf current.tmp current && sudo /usr/local/sbin/emlr-site-ctl restart"
$SSH "curl -fsS --max-time 5 http://127.0.0.1:5050/health" && echo && echo "Rolled back to $PREV"
