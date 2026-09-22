# Tech Stack chính thức

Quyết định này thay thế toàn bộ đề xuất Backend trước đây dùng Node.js, Express và Prisma.

## Stack đã thống nhất

| Lớp | Công nghệ |
|---|---|
| Frontend | TypeScript, React, Vite, Axios, React Router |
| Backend | Java 21 LTS, Spring Boot, Spring Web |
| ORM | Spring Data JPA, Hibernate |
| Migration | Flyway |
| Validation | Jakarta Bean Validation |
| Authentication/Authorization | Spring Security, JWT |
| API documentation | Springdoc OpenAPI/Swagger |
| Build | Maven |
| Testing | JUnit 5, Mockito, Spring Boot Test |
| Logging | SLF4J, Logback |
| Database | PostgreSQL |
| DevOps | Docker, Docker Compose, GitHub Actions, Git, GitHub |

## Kiến trúc tổng thể

```text
React Frontend
      │
      │ HTTPS / REST JSON
      ▼
Spring Boot REST API
      │
      │ Spring Data JPA / Hibernate / Flyway
      ▼
PostgreSQL
```

React phụ trách giao diện và gọi API. Spring Boot cung cấp REST API, validation, bảo mật và xử lý nghiệp vụ. PostgreSQL lưu trữ dữ liệu; Flyway quản lý thay đổi schema có phiên bản.

## Kiểm thử và DevOps

- JUnit 5, Mockito và Spring Boot Test phục vụ unit test và integration test.
- SLF4J với Logback là cơ chế logging mặc định.
- Docker, Docker Compose và GitHub Actions sẽ được triển khai trong các issue DevOps riêng.
- BE-001 chỉ khởi tạo skeleton, chưa có API, entity, migration nghiệp vụ hoặc container.
