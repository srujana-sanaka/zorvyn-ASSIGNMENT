const http = require('http');
const { createApp } = require('./app');
const { env } = require('./config/env');
const { logger } = require('./utils/logger');

const app = createApp();
const server = http.createServer(app);

server.listen(env.port, () => {
  logger.info(`API listening on port ${env.port}`, { env: env.nodeEnv });
});

// Basic shutdown handling for platforms that send SIGTERM (Render/Railway/etc).
function shutdown(signal) {
  logger.warn(`Received ${signal}. Shutting down...`);
  server.close(() => {
    process.exit(0);
  });

  // If it doesn't close in time, force exit.
  setTimeout(() => process.exit(1), 10_000).unref();
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
