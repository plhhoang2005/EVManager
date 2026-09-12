import type { NextFunction, Request, Response } from 'express';

import { logger } from '../../config/logger';

export const requestLogger = (request: Request, response: Response, next: NextFunction): void => {
  const startedAt = Date.now();

  response.on('finish', () => {
    logger.http('HTTP request completed', {
      method: request.method,
      path: request.originalUrl,
      statusCode: response.statusCode,
      durationMs: Date.now() - startedAt,
    });
  });

  next();
};
