module.exports = [
  {
    script: "src/server.js",
    name: "app",
    exec_mode: "fork",
    instances: 1,
    autorestart: true,
    watch: false,
    restart_delay: 10000
  }
];
