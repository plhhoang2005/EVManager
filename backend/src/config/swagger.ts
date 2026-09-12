export const swaggerDocument = {
  openapi: '3.0.3',
  info: {
    title: 'EVManager API',
    version: '0.1.0',
    description: 'REST API cho hệ thống quản lý dịch vụ sự kiện.',
  },
  paths: {
    '/api/v1/health': {
      get: {
        summary: 'Kiểm tra trạng thái API',
        tags: ['Health'],
        responses: {
          '200': {
            description: 'API đang hoạt động',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['success', 'data'],
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: {
                      type: 'object',
                      required: ['status'],
                      properties: {
                        status: { type: 'string', example: 'UP' },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};
