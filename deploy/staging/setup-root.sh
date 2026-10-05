#!/usr/bin/env bash
# One-time root setup for site.emlrkicukiroparish.org (staging).
# Run:  sudo bash ~/emlr-staging-setup/setup-root.sh
# Creates only NEW things; never edits existing vhosts, databases, users or services.
set -euo pipefail

DOMAIN=site.emlrkicukiroparish.org
APP=/var/www/$DOMAIN
SRC="$(cd "$(dirname "$0")" && pwd)"
DEPLOY_USER=emlrkicukiro
step() { echo; echo "==> $*"; }

[ "$(id -u)" = 0 ] || { echo "Run with sudo"; exit 1; }
[ -f "$SRC/site.env" ] || { echo "missing $SRC/site.env"; exit 1; }

step "1/9 PostgreSQL 16 (new package; MySQL is not touched)"
if ! command -v psql >/dev/null || ! systemctl list-unit-files postgresql.service >/dev/null 2>&1; then
  apt-get update -qq
  DEBIAN_FRONTEND=noninteractive apt-get install -y -qq postgresql postgresql-contrib
fi
systemctl enable --now postgresql >/dev/null
ss -tlnH | awk '{print $4}' | grep -E ':5432$' | sed 's/^/   postgres listening on /'

step "2/9 App user 'emlrsite' (system user, no login shell)"
id emlrsite >/dev/null 2>&1 || useradd --system --home-dir "$APP" --shell /usr/sbin/nologin emlrsite
usermod -aG emlrsite "$DEPLOY_USER"   # lets the deploy user upload releases (group write)

step "3/9 Directories"
install -d -o emlrsite -g emlrsite -m 2775 "$APP" "$APP/releases" "$APP/shared" "$APP/acme" "$APP/backups"
install -d -o emlrsite -g emlrsite -m 2775 "$APP/shared/media" "$APP/shared/media/uploads"
install -d -o emlrsite -g emlrsite -m 2770 /var/log/emlr-site
chmod 2750 "$APP/backups"
# nginx (www-data) needs to read the site files and media
setfacl -m u:www-data:rx "$APP" "$APP/releases" "$APP/shared" "$APP/acme" 2>/dev/null || chmod o+rx "$APP" "$APP/releases" "$APP/shared" "$APP/acme"
chmod o+rx "$APP/shared/media" "$APP/shared/media/uploads"

step "4/9 Environment file (mode 600, owner emlrsite)"
install -o emlrsite -g emlrsite -m 600 "$SRC/site.env" "$APP/shared/.env"
shred -u "$SRC/site.env"

step "5/9 Database 'emlr_site' + user 'emlr_site' (rights on this database only)"
DB_PASS=$(grep -E '^DATABASE_URL=' "$APP/shared/.env" | sed -E 's#.*://emlr_site:([^@]+)@.*#\1#')
sudo -u postgres psql -v ON_ERROR_STOP=1 -q <<SQL
DO \$\$ BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'emlr_site') THEN
    CREATE ROLE emlr_site LOGIN PASSWORD '$DB_PASS' NOSUPERUSER NOCREATEDB NOCREATEROLE;
  END IF;
END \$\$;
SQL
sudo -u postgres psql -tAc "SELECT 1 FROM pg_database WHERE datname='emlr_site'" | grep -q 1 \
  || sudo -u postgres createdb -O emlr_site emlr_site
sudo -u postgres psql -q -c "REVOKE ALL ON DATABASE emlr_site FROM PUBLIC;"
unset DB_PASS

step "6/9 Control + backup scripts, sudo rule (only this script), logrotate, systemd unit"
install -o root -g root -m 755 "$SRC/emlr-site-ctl" /usr/local/sbin/emlr-site-ctl
install -o root -g root -m 755 "$SRC/emlr-site-backup" /usr/local/sbin/emlr-site-backup
install -o root -g root -m 440 "$SRC/sudoers" /etc/sudoers.d/emlr-site
visudo -cf /etc/sudoers.d/emlr-site
install -o root -g root -m 644 "$SRC/logrotate.conf" /etc/logrotate.d/emlr-site
install -o root -g root -m 644 "$SRC/emlr-site-api.service" /etc/systemd/system/emlr-site-api.service
systemctl daemon-reload
systemctl enable emlr-site-api >/dev/null   # started after the first release is uploaded

step "7/9 Daily database backup (03:15) for emlr_site only"
echo "15 3 * * * emlrsite /usr/local/sbin/emlr-site-backup >> /var/log/emlr-site/backup.log 2>&1" > /etc/cron.d/emlr-site-backup
chmod 644 /etc/cron.d/emlr-site-backup

step "8/9 nginx: one NEW vhost for $DOMAIN (HTTP until the certificate exists)"
install -o root -g root -m 644 "$SRC/nginx-common.inc" /etc/nginx/snippets/emlr-site-common.conf
install -o root -g root -m 644 "$SRC/nginx-http.conf" /etc/nginx/sites-available/$DOMAIN
ln -sfn /etc/nginx/sites-available/$DOMAIN /etc/nginx/sites-enabled/$DOMAIN
if nginx -t; then
  systemctl reload nginx
else
  echo "nginx -t FAILED: removing the new vhost, nothing reloaded"
  rm -f /etc/nginx/sites-enabled/$DOMAIN
  exit 1
fi

step "9/9 Done"
echo "   app dir:   $APP"
echo "   service:   emlr-site-api (127.0.0.1:5050, starts after first release)"
echo "   logs:      /var/log/emlr-site/"
echo "   Next: the deploy user must log in again (new group), then run deploy.sh"
