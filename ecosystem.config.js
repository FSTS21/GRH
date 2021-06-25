module.exports = {
  apps : [{
    script: './bin/www',
    // watch: '.',
    // Options reference: https://pm2.keymetrics.io/docs/usage/application-declaration/
    instances: "max",
    exec_mode: "cluster",
    watch: false,
    // ignore_watch : ["node_modules", "client/img"],
    autorestart: true,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production'
    },
    env_development: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  }],

  deploy : {
    production : {
      user: 'root',
      host:  '172.16.5.4',
      port: "22",
      ref: 'origin/main',
      repo: 'git@github.com:FSTS21/GRH.git',
      path: '/var/www/GRH',

      "pre-setup" : "apt-get install git",
      "pre-deploy-local" : "echo 'This is a local executed command'",
      'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env production',
      "post-setup": "ls -la",

    }
  }
};
