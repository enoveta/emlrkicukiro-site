#!/usr/bin/env bash
# Nightly backup of the database and uploaded media. Keeps 14 days.
# crontab -e  →  30 2 * * * /var/www/emlr/deploy/backup.sh >> /var/log/emlr/backup.log 2>&1
set -euo pipefail
DEST=/var/backups/emlr
STAMP=$(date +%Y-%m-%d_%H%M)
mkdir -p "$DEST"
set -a; source /var/www/emlr/Backend/.env; set +a
pg_dump "${DATABASE_URL%%\?*}" | gzip > "$DEST/db_$STAMP.sql.gz"
tar -czf "$DEST/uploads_$STAMP.tar.gz" -C /var/www/emlr/Backend/public/media uploads
find "$DEST" -type f -mtime +14 -delete
echo "$(date) backup ok"
