# EVManager Backend

Backend REST API của EVManager sử dụng Node.js, TypeScript, Express, Prisma và PostgreSQL.

## Yêu cầu

- Node.js 22 LTS trở lên (khuyến nghị Node.js 24 LTS)
- npm 10 trở lên
- PostgreSQL khi bắt đầu dùng migration hoặc module cần database

## Cài đặt

```bash
cd backend
npm install
```

Sao chép file môi trường mẫu và thay giá trị bằng cấu hình local của bạn:

```bash
cp .env.example .env
```

Trên PowerShell:

```powershell
Copy-Item .env.example .env
```

Không commit `.env`. Ứng dụng sẽ dừng ngay khi thiếu hoặc sai biến môi trường bắt buộc.

## Lệnh thường dùng

```bash
npm run dev                 # Chạy development với hot reload
npm run build               # Biên dịch TypeScript vào dist/
npm start                   # Chạy bản đã build
npm test                    # Chạy test một lần
npm run test:watch          # Chạy test ở watch mode
npm run lint                # Kiểm tra ESLint
npm run format              # Định dạng bằng Prettier
npm run prisma:generate     # Tạo Prisma Client
npm run prisma:migrate      # Tạo/áp dụng migration development
```

`prisma:migrate` cần PostgreSQL hoạt động và `DATABASE_URL` hợp lệ. Không dùng `prisma db push` thay cho migration trong quy trình chính thức.

## Endpoint

- Health Check: `GET http://localhost:3000/api/v1/health`
- Swagger UI: `http://localhost:3000/api-docs`

Ví dụ Health Check:

```json
{
  "success": true,
  "data": {
    "status": "UP"
  }
}
```

## Cấu trúc

```text
backend/
├── prisma/schema.prisma
├── src/
│   ├── app.ts
│   ├── server.ts
│   ├── config/
│   ├── common/
│   └── modules/health/
└── tests/
```

## Chưa triển khai

Skeleton này chưa có authentication/JWT, RBAC, entity nghiệp vụ, CRUD, migration bảng nghiệp vụ, email, Docker, CI/CD, deployment, báo cáo, dashboard hoặc AI/ML. Health Check hiện không truy cập PostgreSQL.
