# Tech Stack

## Stack đã thống nhất

| Lớp | Công nghệ |
|---|---|
| Frontend | React, TypeScript, Vite, Axios, React Router |
| Backend | Node.js LTS, TypeScript strict, Express.js, Express Router |
| Validation và bảo mật | Zod, Helmet, CORS; JWT và RBAC ở issue riêng |
| Database | PostgreSQL, Prisma ORM, Prisma Migrate |
| API documentation | Swagger/OpenAPI |
| Logging | Winston |
| Testing | Jest, Supertest |
| Package manager | npm |
| DevOps dự kiến | Docker, Docker Compose, GitHub Actions, GitHub |

## Lý do lựa chọn

- **Node.js:** phù hợp REST API I/O-bound và dùng chung hệ sinh thái JavaScript với Frontend.
- **TypeScript:** thống nhất ngôn ngữ giữa Frontend và Backend, tăng an toàn kiểu dữ liệu và khả năng bảo trì.
- **Express:** gọn, phổ biến và đủ linh hoạt cho phạm vi đồ án tám tuần.
- **Prisma:** cung cấp type-safe database access, schema rõ ràng và quy trình migration có kiểm soát.
- **PostgreSQL:** cơ sở dữ liệu quan hệ ổn định, phù hợp dữ liệu khách hàng, hợp đồng, lịch và thanh toán.

## Kiến trúc tổng thể

```text
React + TypeScript
        │
        │ HTTPS / REST JSON
        ▼
Node.js + Express + TypeScript
        │
        │ Prisma ORM / Prisma Migrate
        ▼
PostgreSQL
```

Frontend chỉ gọi REST API; các quy tắc nghiệp vụ, Authentication và Authorization được thực thi ở Backend. Schema nghiệp vụ sẽ được bổ sung sau khi ERD được nhóm duyệt.

## Kiểm thử và DevOps

- Jest thực thi unit test; Supertest kiểm thử tích hợp HTTP mà không cần mở cổng mạng.
- Health Check skeleton không phụ thuộc PostgreSQL.
- Docker, Docker Compose và GitHub Actions được dự kiến cho các issue DevOps sau; chưa được triển khai trong BE-001.
