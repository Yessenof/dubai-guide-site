// PM2 ecosystem config for guidex-production.
// No secrets here — all secrets live in .env.local on the server (gitignored).
// Deploy: cd /var/www/guidex && pm2 start ecosystem.config.js --env production
// Restart: pm2 restart guidex-production --update-env

module.exports = {
  apps: [
    {
      name:    "guidex-production",
      script:  "node_modules/.bin/next",
      args:    "start",
      cwd:     "/var/www/guidex",

      instances:           1,
      exec_mode:           "fork",
      autorestart:         true,
      watch:               false,
      max_memory_restart:  "512M",

      env: {
        NODE_ENV: "production",
        PORT:     "3000",
      },

      error_file: "/var/log/guidex/pm2-error.log",
      out_file:   "/var/log/guidex/pm2-out.log",
      merge_logs: true,
      time:       true,
    },
  ],
};
