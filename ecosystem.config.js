module.exports = {
  apps: [{
    name: 'FE_F17-SPRP',
    script: 'node_modules/next/dist/bin/next',
    args: 'start -p 8078',
    env_production: {
      NODE_ENV: 'production',
      PORT: 8078,
    }
  }]
};