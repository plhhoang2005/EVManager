import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config({ quiet: true });

const environmentSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']),
  PORT: z.coerce.number().int().positive().max(65_535),
  DATABASE_URL: z.string().url().startsWith('postgresql://'),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must contain at least 32 characters'),
  JWT_EXPIRES_IN: z.string().min(1),
  CORS_ORIGIN: z.string().url(),
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'http', 'verbose', 'debug', 'silly']),
});

const parsedEnvironment = environmentSchema.safeParse(process.env);

if (!parsedEnvironment.success) {
  const issues = parsedEnvironment.error.issues
    .map((issue) => `${issue.path.join('.') || 'environment'}: ${issue.message}`)
    .join('; ');

  throw new Error(`Invalid environment configuration: ${issues}`);
}

export const env = parsedEnvironment.data;
