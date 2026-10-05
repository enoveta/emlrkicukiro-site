// PM2 process file:  pm2 start deploy/ecosystem.config.js && pm2 save && pm2 startup
module.exports = {
  apps: [
    {
      name: 'emlr-api',
      cwd: '/var/www/emlr/Backend',
      script: 'dist/src/index.js',
      env: { NODE_ENV: 'production' },
      instances: 1,
      autorestart: true,
      max_memory_restart: '400M',
      restart_delay: 3000,
      out_file: '/var/log/emlr/api.out.log',
      error_file: '/var/log/emlr/api.err.log',
      time: true,
    },
  ],
};
