# Staging: site.emlrkicukiroparish.org

Pre-launch copy of the EMLR Kicukiro website on the shared server (`ssh emlrkicukiro`).
Hidden from search engines (`X-Robots-Tag: noindex` + disallow-all `robots.txt`).

| What | Where |
|---|---|
| Website | https://site.emlrkicukiroparish.org |
| Dashboard | https://site.emlrkicukiroparish.org/admin |
| App folder | `/var/www/site.emlrkicukiroparish.org/` |
| Releases | `releases/<timestamp>/`, active one = `releases/current` (`current` → `releases/current`) |
| Settings | `shared/.env` (root:emlrsite 640) |
| Uploads / media | `shared/media/` |
| Backups | `backups/` (daily 03:15, 14 days): database `emlr_site` + media |
| API service | `emlr-site-api` (systemd, user `emlrsite`) on **127.0.0.1:5050** |
| Database | PostgreSQL 16, database `emlr_site`, user `emlr_site` (local only) |
| API logs | `/var/log/emlr-site/api.log`, `api.error.log`, `backup.log` (logrotate weekly) |
| nginx logs | `/var/log/nginx/site.emlrkicukiroparish.org.access.log` / `.error.log` |
| nginx vhost | `/etc/nginx/sites-available/site.emlrkicukiroparish.org` + `/etc/nginx/snippets/emlr-site-common.conf` |

## Deploy a new version (from your computer, project root)

```bash
./deploy/staging/deploy.sh           # build, upload, install, switch, migrate, restart, health-check
./deploy/staging/deploy.sh --media   # same + sync Backend/public/media
```

If the health check fails, the script switches back to the previous release automatically.

## Roll back

```bash
./deploy/staging/rollback.sh         # previous release + API restart (migrations are not reversed)
```

## Day-to-day (on the server, no password needed for these)

```bash
sudo emlr-site-ctl status            # service status
sudo emlr-site-ctl logs 200          # last 200 API log lines
sudo emlr-site-ctl restart           # restart the API only
sudo emlr-site-ctl migrate-status    # pending database migrations
sudo emlr-site-ctl backup            # backup now
sudo emlr-site-ctl nginx-reload      # nginx -t, then reload
```

`emlr-site-ctl` is the only command the deploy user may run with sudo (`/etc/sudoers.d/emlr-site`).
It never reads `.env` or runs release files as root; app commands run as `emlrsite`.

## Restore a backup

```bash
gunzip -c backups/emlr_site_<date>.sql.gz | sudo -u emlrsite psql "$(sudo grep ^DATABASE_URL= shared/.env | cut -d= -f2- | tr -d '"' | cut -d? -f1)"
tar -xzf backups/media_<date>.tar.gz -C shared/
```

## One-time setup files (already applied)

`setup-root.sh` (user, folders, PostgreSQL, service, vhost, sudo rule, backups, logrotate) and
`ssl-root.sh` (certificate via `certbot certonly --webroot`, HTTPS vhost). Both are safe to re-run.
