#!/usr/bin/env bash
# One-time root setup for site.emlrkicukiroparish.org (staging). Safe to re-run.
# Run:  sudo bash ~/emlr-staging-setup/setup-root.sh
# Creates only NEW things; never edits existing vhosts, databases, users or services.
#
# Permission model: the deploy user (emlrkicukiro) can write ONLY releases/ and shared/media/.
# Everything root reads or runs (scripts, .env, nginx/systemd files, $APP, $APP/shared, the
# $APP/current link) is root-owned and not writable by the deploy user.
set -euo pipefail

DOMAIN=site.emlrkicukiroparish.org
APP=/var/www/$DOMAIN
SRC="$(cd "$(dirname "$0")" && pwd)"
DEPLOY_USER=emlrkicukiro
step() { echo; echo "==> $*"; }

[ "$(id -u)" = 0 ] || { echo "Run with sudo"; exit 1; }

step "1/9 PostgreSQL 16 (new package; MySQL is not touched)"
if ! systemctl list-unit-files postgresql.service >/dev/null 2>&1; then
  apt-get update -qq
  DEBIAN_FRONTEND=noninteractive apt-get install -y -qq postgresql postgresql-contrib
fi
systemctl enable --now postgresql >/dev/null
ss -tlnH | awk '{print $4}' | grep -E ':5432$' | sed 's/^/   postgres listening on /'

step "2/9 App user 'emlrsite' (system user, no login shell)"
id emlrsite >/dev/null 2>&1 || useradd --system --home-dir "$APP" --no-create-home --shell /usr/sbin/nologin emlrsite
id -nG "$DEPLOY_USER" | grep -qw emlrsite || usermod -aG emlrsite "$DEPLOY_USER"   # group write on releases/ and shared/media/ only

step "3/9 Directories and permissions"
install -d -o root     -g emlrsite -m 2755 "$APP" "$APP/shared"          # not group-writable
install -d -o emlrsite -g emlrsite -m 2775 "$APP/releases" "$APP/shared/media" "$APP/shared/media/uploads"
install -d -o emlrsite -g emlrsite -m 2770 "$APP/releases/.home"          # npm/prisma cache for app commands
install -d -o emlrsite -g emlrsite -m 2750 "$APP/backups" /var/log/emlr-site
install -d -o root     -g root     -m 0755 "$APP/acme"                    # certbot webroot
for f in api.log api.error.log backup.log; do                             # pre-create so logrotate (su emlrsite) can rotate them
  [ -e "/var/log/emlr-site/$f" ] || install -o emlrsite -g emlrsite -m 640 /dev/null "/var/log/emlr-site/$f"
done
# Fixed root-owned link; the deploy user switches only releases/current
ln -sfn "$APP/releases/current" "$APP/current.tmp" && mv -Tf "$APP/current.tmp" "$APP/current"
chown -h root:emlrsite "$APP/current"

step "4/9 Environment file (root:emlrsite 640)"
if [ -f "$APP/shared/.env" ]; then
  echo "   $APP/shared/.env already exists; leaving it unchanged"
  [ -f "$SRC/site.env" ] && shred -u "$SRC/site.env" && echo "   discarded uploaded site.env"
else
  [ -f "$SRC/site.env" ] || { echo "missing $SRC/site.env"; exit 1; }
  install -o root -g emlrsite -m 640 "$SRC/site.env" "$APP/shared/.env"
  shred -u "$SRC/site.env"
fi

step "5/9 Database 'emlr_site' + user 'emlr_site' (rights on this database only)"
DB_PASS=$(grep -E '^DATABASE_URL=' "$APP/shared/.env" | sed -E 's#^DATABASE_URL="?postgresql://emlr_site:([^@]+)@.*#\1#')
if ! [[ "$DB_PASS" =~ ^[A-Za-z0-9]{16,128}$ ]]; then
  echo "Database password in .env must be 16-128 letters/digits only; aborting"; exit 1
fi
if ! sudo -u postgres psql -tAc "SELECT 1 FROM pg_roles WHERE rolname='emlr_site'" | grep -q 1; then
  sudo -u postgres psql -v ON_ERROR_STOP=1 -q -c \
    "CREATE ROLE emlr_site LOGIN PASSWORD '$DB_PASS' NOSUPERUSER NOCREATEDB NOCREATEROLE;"
else
  echo "   role emlr_site already exists; password unchanged"
fi
unset DB_PASS
sudo -u postgres psql -tAc "SELECT 1 FROM pg_database WHERE datname='emlr_site'" | grep -q 1 \
  || sudo -u postgres createdb -O emlr_site emlr_site
sudo -u postgres psql -q -c "REVOKE ALL ON DATABASE emlr_site FROM PUBLIC;"

step "6/9 Control + backup scripts, sudo rule (only the control script), logrotate, systemd unit"
install -o root -g root -m 755 "$SRC/emlr-site-ctl" /usr/local/sbin/emlr-site-ctl
install -o root -g root -m 755 "$SRC/emlr-site-backup" /usr/local/sbin/emlr-site-backup
install -o root -g root -m 440 "$SRC/sudoers" /etc/sudoers.d/emlr-site.new
if visudo -cf /etc/sudoers.d/emlr-site.new; then
  mv -f /etc/sudoers.d/emlr-site.new /etc/sudoers.d/emlr-site
else
  rm -f /etc/sudoers.d/emlr-site.new; echo "sudoers rule invalid; not installed"; exit 1
fi
install -o root -g root -m 644 "$SRC/logrotate.conf" /etc/logrotate.d/emlr-site
install -o root -g root -m 644 "$SRC/emlr-site-api.service" /etc/systemd/system/emlr-site-api.service
systemctl daemon-reload
systemctl enable emlr-site-api >/dev/null   # started after the first release is uploaded

step "7/9 Daily database backup (03:15) for emlr_site only"
echo "15 3 * * * emlrsite /usr/local/sbin/emlr-site-backup >> /var/log/emlr-site/backup.log 2>&1" > /etc/cron.d/emlr-site-backup
chmod 644 /etc/cron.d/emlr-site-backup

step "8/9 nginx: one NEW vhost for $DOMAIN (HTTP until the certificate exists)"
install -o root -g root -m 644 "$SRC/nginx-common.inc" /etc/nginx/snippets/emlr-site-common.conf
if [ ! -e /etc/letsencrypt/live/$DOMAIN/fullchain.pem ]; then
  install -o root -g root -m 644 "$SRC/nginx-http.conf" /etc/nginx/sites-available/$DOMAIN
else
  echo "   certificate exists; keeping the current vhost file"
fi
ln -sfn /etc/nginx/sites-available/$DOMAIN /etc/nginx/sites-enabled/$DOMAIN
if nginx -t; then
  systemctl reload nginx
else
  echo "nginx -t FAILED: removing the new vhost, nothing reloaded"
  rm -f /etc/nginx/sites-enabled/$DOMAIN
  exit 1
fi

step "9/9 Done"
echo "   app dir:   $APP   (current -> releases/current, switched by deploy.sh)"
echo "   service:   emlr-site-api (127.0.0.1:5050, starts after the first release)"
echo "   logs:      /var/log/emlr-site/  (nginx: /var/log/nginx/$DOMAIN.*.log)"
echo "   Next: run deploy.sh from your computer (new SSH login picks up the emlrsite group)"
