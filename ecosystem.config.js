// PM2 config for The Stems (DigitalOcean)
module.exports = {
  apps: [
    {
      name: 'thestems',
      script: 'npm',
      args: 'start',
      cwd: '/var/www/thestems',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        NODE_OPTIONS: '--max-old-space-size=2048',
      },
      error_file: '/var/www/thestems/logs/pm2-error.log',
      out_file: '/var/www/thestems/logs/pm2-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s',
      max_memory_restart: '1536M',
    },
  ],
};
