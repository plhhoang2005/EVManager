import request from 'supertest';

import { app } from '../src/app';

describe('GET /api/v1/health', () => {
  it('returns the API health status', async () => {
    const response = await request(app).get('/api/v1/health');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      success: true,
      data: {
        status: 'UP',
      },
    });
  });
});

describe('unknown route', () => {
  it('returns a consistent 404 response', async () => {
    const response = await request(app).get('/api/v1/does-not-exist');

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: 'Route not found',
      },
    });
  });
});
