import { app } from './app';
import { env } from './config/env';
import { logger } from './config/logger';

const server = app.listen(env.PORT, () => {
  logger.info('EVManager API started', {
    environment: env.NODE_ENV,
    port: env.PORT,
  });
});

server.on('error', (error) => {
  logger.error('EVManager API failed to start', {
    error: error instanceof Error ? error.message : 'Unknown startup error',
  });
  process.exitCode = 1;
});
