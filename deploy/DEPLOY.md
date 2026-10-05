# Deploying EMLR Kicukiro to a VPS

Target: Ubuntu 22.04/24.04 VPS, one domain (examples use `emlrkicukiro.rw`; replace it everywhere).
The site, API and media all share that one domain:

| Path        | Served by                              |
|-------------|----------------------------------------|
| `/`         | nginx → `build/` (React app)           |
| `/api/*`    | nginx → Node API on `127.0.0.1:5050`    |
| `/media/*`  | nginx → files on disk (works even if the API is down) |

## 1. Server packages (once)

```bash
sudo apt update && sudo apt install -y nginx postgresql git certbot python3-certbot-nginx
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash - && sudo apt install -y nodejs
sudo npm i -g pm2
sudo mkdir -p /var/www/emlr /var/log/emlr /var/backups/emlr
sudo chown -R $USER /var/www/emlr /var/log/emlr /var/backups/emlr
```

## 2. Database (once)

```bash
sudo -u postgres psql -c "CREATE USER emlr WITH PASSWORD 'a-long-random-password';"
sudo -u postgres psql -c "CREATE DATABASE emlr OWNER emlr;"
```

## 3. Code and configuration (once)

```bash
git clone <repo-url> /var/www/emlr && cd /var/www/emlr
cp Backend/.env.example Backend/.env
nano Backend/.env          # fill in every CHANGE_ME, keys and the domain
```

Copy the media folder from your computer (it is not all in git):

```bash
rsync -av Backend/public/media/ user@SERVER:/var/www/emlr/Backend/public/media/
```

## 4. First install

```bash
cd /var/www/emlr/Backend && npm ci && npx prisma migrate deploy && npx prisma generate
npx prisma db seed           # creates the admin + starting content (only on an empty database)
npm run build && pm2 start ../deploy/ecosystem.config.js && pm2 save && pm2 startup
cd .. && npm ci && SNAPSHOT_API=http://127.0.0.1:5050 SITE_URL=https://emlrkicukiro.rw npm run build
```

## 5. nginx + HTTPS

```bash
sudo cp deploy/nginx.conf /etc/nginx/sites-available/emlr
sudo ln -s /etc/nginx/sites-available/emlr /etc/nginx/sites-enabled/emlr
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx
sudo certbot --nginx -d emlrkicukiro.rw -d www.emlrkicukiro.rw
```

## 6. Backups

```bash
crontab -e
# add:
30 2 * * * /var/www/emlr/deploy/backup.sh >> /var/log/emlr/backup.log 2>&1
```

Restore: `gunzip -c db_DATE.sql.gz | psql "$DATABASE_URL"` and untar the uploads archive into `Backend/public/media/`.

## 7. Updating the site later

```bash
cd /var/www/emlr && git pull && SITE_URL=https://emlrkicukiro.rw ./deploy/deploy.sh
```

Each build saves the live content into the site itself, so pages still show text if the API ever stops.
Content edited in the dashboard appears immediately; the bundled copy refreshes on the next deploy.

## 8. After going live — checklist

- [ ] Log in at `/admin`, open **Account & users** and change the admin password.
- [ ] **Site settings**: check phone, email, service times (EN + RW) and social links.
- [ ] **Giving accounts**: confirm the MTN / Airtel / bank details with the treasurer.
- [ ] Google AI Studio: rotate the Gemini key (it was shared in chat) and put the new one in `Backend/.env`, then `pm2 reload emlr-api`.
- [ ] Google Cloud: restrict the YouTube API key to the server IP.
- [ ] Submit `https://emlrkicukiro.rw/sitemap.xml` in Google Search Console.
- [ ] `pm2 logs emlr-api` shows no errors; `curl https://emlrkicukiro.rw/health` returns `{"ok":true}`.
