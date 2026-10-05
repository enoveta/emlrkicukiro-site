#!/usr/bin/env bash
# HTTPS for site.emlrkicukiroparish.org only. Run:  sudo bash ~/emlr-staging-setup/ssl-root.sh
# certbot "certonly --webroot": obtains the certificate without editing any nginx file.
set -euo pipefail
DOMAIN=site.emlrkicukiroparish.org
APP=/var/www/$DOMAIN
SRC="$(cd "$(dirname "$0")" && pwd)"
VHOST=/etc/nginx/sites-available/$DOMAIN
[ "$(id -u)" = 0 ] || { echo "Run with sudo"; exit 1; }

echo "==> 1/3 Certificate (this subdomain only; renewals reload nginx)"
if [ ! -e /etc/letsencrypt/live/$DOMAIN/fullchain.pem ]; then
  certbot certonly --webroot -w "$APP/acme" -d "$DOMAIN" --non-interactive --agree-tos \
    --register-unsafely-without-email --deploy-hook "systemctl reload nginx" \
    || certbot certonly --webroot -w "$APP/acme" -d "$DOMAIN" --non-interactive --agree-tos --deploy-hook "systemctl reload nginx"
else
  echo "   certificate already exists"
fi

echo "==> 2/3 HTTPS vhost (backup of the HTTP version kept)"
cp -a "$VHOST" "$VHOST.http.bak"
install -o root -g root -m 644 "$SRC/nginx-https.conf" "$VHOST"
[ -e /etc/letsencrypt/ssl-dhparams.pem ] || sed -i '/ssl_dhparam/d' "$VHOST"
[ -e /etc/letsencrypt/options-ssl-nginx.conf ] || sed -i '/options-ssl-nginx.conf/d' "$VHOST"

echo "==> 3/3 nginx -t, then reload"
if nginx -t; then
  systemctl reload nginx
  rm -f "$VHOST.http.bak"
  echo "==> HTTPS enabled for https://$DOMAIN"
else
  echo "nginx -t FAILED: restoring the HTTP vhost, nothing reloaded"
  mv -f "$VHOST.http.bak" "$VHOST"
  nginx -t
  exit 1
fi
