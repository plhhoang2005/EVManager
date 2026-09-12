import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';

import { errorHandler } from './common/middleware/error-handler.middleware';
import { notFoundHandler } from './common/middleware/not-found.middleware';
import { requestLogger } from './common/middleware/request-logger.middleware';
import { env } from './config/env';
import { swaggerDocument } from './config/swagger';
import { healthRouter } from './modules/health/health.routes';

export const app = express();

app.disable('x-powered-by');
app.use(helmet());
app.use(
  cors({
    origin: env.CORS_ORIGIN,
  }),
);
app.use(express.json({ limit: '1mb' }));
app.use(requestLogger);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api/v1/health', healthRouter);

app.use(notFoundHandler);
app.use(errorHandler);
