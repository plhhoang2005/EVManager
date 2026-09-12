process.env.NODE_ENV = 'test';
process.env.PORT = '3000';
process.env.DATABASE_URL =
  'postgresql://test_user:test_password@localhost:5432/event_management_test?schema=public';
process.env.JWT_SECRET = 'test-only-secret-with-at-least-32-characters';
process.env.JWT_EXPIRES_IN = '1h';
process.env.CORS_ORIGIN = 'http://localhost:5173';
process.env.LOG_LEVEL = 'error';
