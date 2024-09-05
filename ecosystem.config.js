module.exports = {
  apps: [{
    name: 'F17-SPRP',
    script: 'node_modules/next/dist/bin/next',
    args: 'start -p 8078',
    watch: false,
    // instances: 'max', // Utilize all available CPU cores
    // exec_mode: 'cluster', // Enable clustering mode
    max_memory_restart: '2G',
    node_args: '--max-old-space-size=2048', // max old space size
    env_production: {
      NODE_ENV: 'production',
      PORT: 8078,
    }
  }]
}