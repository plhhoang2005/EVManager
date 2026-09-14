# EVManager Backend

Backend skeleton của EVManager sử dụng Java 21 LTS, Spring Boot, Maven và PostgreSQL.

## Yêu cầu

- JDK 21 LTS
- PostgreSQL cho việc khởi động ứng dụng ở môi trường development
- Không cần cài Maven toàn hệ thống; repository cung cấp Maven Wrapper

## Cấu hình môi trường

Sao chép file mẫu và thay các giá trị giả bằng cấu hình local:

```bash
cp .env.example .env
```

Trên PowerShell:

```powershell
Copy-Item .env.example .env
```

Spring Boot đọc `.env` như một file properties thông qua `spring.config.import`. Không commit `.env`, password hoặc JWT secret thật.

## Lệnh thường dùng

Linux/macOS:

```bash
./mvnw clean test
./mvnw clean package
./mvnw spring-boot:run
```

Windows PowerShell:

```powershell
.\mvnw.cmd clean test
.\mvnw.cmd clean package
.\mvnw.cmd spring-boot:run
```

Flyway tự kiểm tra và áp dụng migration khi ứng dụng kết nối PostgreSQL. BE-001 chưa có migration nghiệp vụ.

## Cấu trúc

```text
backend/
├── .mvn/wrapper/
├── src/
│   ├── main/
│   │   ├── java/com/evmanager/backend/EvManagerApplication.java
│   │   └── resources/application.yml
│   └── test/
├── .env.example
├── mvnw
├── mvnw.cmd
└── pom.xml
```

## Chưa triển khai

Skeleton này chưa có REST controller, Authentication/JWT, RBAC, entity, repository, service, CRUD, migration nghiệp vụ, Docker, CI/CD, dashboard, báo cáo hoặc AI/ML. Swagger UI sẽ có tại `/api-docs` sau khi có API và ứng dụng được khởi động với database hợp lệ.
