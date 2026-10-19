# EVManager Backend

This is the Spring Boot backend for the EVManager Wedding & Convention Center Management System.

## Tech Stack
- Java 21 LTS
- Spring Boot 3.3.4
- Spring Web
- Spring Data JPA + Hibernate
- PostgreSQL 16
- Flyway Migration
- Spring Security + JWT (jjwt 0.12.6)
- Jakarta Bean Validation
- Springdoc OpenAPI 2.6.0 (Swagger)
- Maven
- JUnit 5 + Mockito

---

## Local Development Setup

### 1. Start PostgreSQL with Docker Compose
```bash
cd backend
docker compose up -d
```
The database will be exposed on port `5434` (mapped from container `5432`).

### 2. Configure Environment Variables
Copy `.env.example` to `.env` or set environment variables:
- `DB_HOST`: `localhost`
- `DB_PORT`: `5434`
- `DB_NAME`: `evmanager`
- `DB_USERNAME`: `postgres`
- `DB_PASSWORD`: `postgres`
- `JWT_SECRET`: Base64-encoded secret key (minimum 256 bits).

### 3. Run Locally
```bash
cd backend
./mvnw spring-boot:run
```

### 4. Run Tests & Package
```bash
# Run unit & integration tests
./mvnw test

# Package production executable jar
./mvnw clean package -DskipTests
```

---

## Staging & Cloud Deployment Guide (BE-30)

### 1. Staging Profile Overview
The `staging` profile (`application-staging.yml`) provides a hardened configuration for cloud deployments (Render, Railway, AWS ECS, GCP Cloud Run):
- **Database**: Connects to Cloud Managed PostgreSQL via TLS/SSL (`sslmode=require`).
- **Flyway**: Auto-migration enabled (`baseline-on-migrate: true`, `validate-on-migrate: true`).
- **JPA**: Strict validation (`ddl-auto: validate`), SQL logging disabled to prevent data leakage.
- **JWT**: Mandatory `JWT_SECRET` environment variable (fails fast if missing, no weak default fallback).
- **Server**: Listens on dynamic `${PORT}` (default `8080`), supports reverse-proxy forwarded headers.

### 2. Staging Environment Variables

| Variable | Description | Example / Required |
| :--- | :--- | :--- |
| `SPRING_PROFILES_ACTIVE` | Active Spring profile | `staging` (Required) |
| `PORT` | HTTP server listening port | `8080` (Auto-provided by cloud platform) |
| `DB_HOST` | Cloud PostgreSQL hostname | `managed-db.example.com` |
| `DB_PORT` | PostgreSQL port | `5432` |
| `DB_NAME` | Database name | `evmanager_staging` |
| `DB_USERNAME` | Database username | `staging_user` |
| `DB_PASSWORD` | Database password | *Secure secret from platform secret manager* |
| `DB_SSL_MODE` | SSL Mode for Managed DB | `require` (Default) |
| `DATABASE_URL` | Optional full JDBC URL | `jdbc:postgresql://host:5432/evmanager?sslmode=require` |
| `JWT_SECRET` | 256-bit signing key | *Secure secret (Base64 string)* (Required) |
| `CORS_ALLOWED_ORIGINS` | Allowed frontend origins | `https://staging-evmanager.example.com,http://localhost:3000` |
| `MAIL_USERNAME` | SMTP account (optional) | `notification@evmanager.vn` |
| `MAIL_PASSWORD` | SMTP app password (optional)| *Secure app password* |

### 3. Container Deployment (Docker)
Build and run the multi-stage secure container:
```bash
# Build Docker image
docker build -t evmanager-backend:staging ./backend

# Run container locally with staging profile
docker run -d \
  -p 8080:8080 \
  -e SPRING_PROFILES_ACTIVE=staging \
  -e DB_HOST=host.docker.internal \
  -e DB_PORT=5434 \
  -e DB_NAME=evmanager \
  -e DB_USERNAME=postgres \
  -e DB_PASSWORD=postgres \
  -e DB_SSL_MODE=disable \
  -e JWT_SECRET=your_super_secret_jwt_key_that_is_at_least_256_bits_long_example \
  --name evmanager-staging \
  evmanager-backend:staging
```

---

## UAT Smoke Testing & Handoff Guide

### 1. Health & Liveness Verification
```bash
# Verify health endpoint (returns HTTP 200 {"status":"ok"})
curl -i https://<STAGING_API_HOST>/api/health
```

### 2. Authentication Smoke Test
```bash
# 1. Login with UAT credentials
curl -i -X POST https://<STAGING_API_HOST>/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"usernameOrEmail":"sales","password":"<SECURE_UAT_PASSWORD>"}'

# 2. Access protected endpoint using Bearer token
curl -i https://<STAGING_API_HOST>/api/v1/venues \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

### 3. Frontend Integration
To point the frontend to the Staging API:
1. Update `API_BASE_URL` in `frontend/js/api.js` (or `.env`):
   ```javascript
   const API_BASE_URL = 'https://<STAGING_API_HOST>/api/v1';
   ```
2. Ensure the frontend domain is listed in `CORS_ALLOWED_ORIGINS` on the backend.

---

## Security Best Practices for Staging & Production
1. **Never commit `.env` or secrets**: All secrets must be configured via cloud platform environment variables.
2. **Never expose default credentials**: Seeded demo accounts must have passwords changed or be disabled before public access.
3. **Database Security**: Managed databases should restrict access to platform private networks or IP allowlists and enforce TLS/SSL.
4. **Flyway Migrations**: Executed automatically on startup; never alter applied migration files or bypass checksums.
