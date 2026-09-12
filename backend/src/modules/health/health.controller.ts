import type { RequestHandler } from 'express';

import { successResponse } from '../../common/responses/api-response';

export const getHealth: RequestHandler = (_request, response): void => {
  response.status(200).json(successResponse({ status: 'UP' }));
};
