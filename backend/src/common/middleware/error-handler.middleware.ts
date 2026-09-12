import type { ErrorRequestHandler } from 'express';

import { logger } from '../../config/logger';
import { AppError } from '../errors/app-error';
import { errorResponse } from '../responses/api-response';

export const errorHandler: ErrorRequestHandler = (error, _request, response, next): void => {
  void next;

  if (error instanceof AppError) {
    response.status(error.statusCode).json(errorResponse(error.code, error.message, error.details));
    return;
  }

  logger.error('Unhandled request error', {
    error:
      error instanceof Error
        ? { name: error.name, message: error.message, stack: error.stack }
        : { message: 'A non-Error value was thrown' },
  });

  response.status(500).json(errorResponse('INTERNAL_SERVER_ERROR', 'Internal server error'));
};
