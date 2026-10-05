    # --- shared by the HTTP (pre-certificate) and HTTPS server blocks ---
    root /var/www/site.emlrkicukiroparish.org/current/build;
    index index.html;
    client_max_body_size 45m;

    access_log /var/log/nginx/site.emlrkicukiroparish.org.access.log;
    error_log  /var/log/nginx/site.emlrkicukiroparish.org.error.log warn;

    # Staging: keep search engines out
    add_header X-Robots-Tag "noindex, nofollow" always;
    add_header X-Content-Type-Options nosniff always;
    add_header Referrer-Policy strict-origin-when-cross-origin always;
    add_header X-Frame-Options SAMEORIGIN always;

    gzip on;
    gzip_comp_level 6;
    gzip_types text/plain text/css application/javascript application/json image/svg+xml application/xml;

    # Note: no add_header inside locations below, so the server-level security and
    # noindex headers apply everywhere (nginx drops inherited headers otherwise).
    location = /robots.txt {
        default_type text/plain;
        return 200 "User-agent: *\nDisallow: /\n";
    }

    location /media/ {
        alias /var/www/site.emlrkicukiroparish.org/shared/media/;
        expires 30d;
        try_files $uri @api;
    }

    location /api/ {
        proxy_pass http://127.0.0.1:5050;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 60s;
    }
    location @api { proxy_pass http://127.0.0.1:5050; proxy_set_header Host $host; proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for; }
    location = /health { proxy_pass http://127.0.0.1:5050; }

    location /static/ { expires 1y; }
    location = /service-worker.js { expires -1; }
    location = /index.html        { expires -1; }

    # Single-page app (includes /admin, the dashboard)
    location / {
        try_files $uri /index.html;
    }
