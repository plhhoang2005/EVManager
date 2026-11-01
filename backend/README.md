# EVManager Backend

This is the Spring Boot backend skeleton for the EVManager project.

## Tech Stack
- Java 21 LTS
- Spring Boot 3
- Spring Web
- Spring Data JPA + Hibernate
- PostgreSQL
- Flyway
- Spring Security + JWT
- Jakarta Bean Validation
- Springdoc OpenAPI (Swagger)
- Maven
- JUnit 5 + Mockito
- SLF4J + Logback

## Environment Variables
Before running the application, make sure to set up the following environment variables or use the default values (for local development, you can use `.env` if your IDE supports it, or set them in your system):

- `DB_HOST`: Database host (default: `localhost`)
- `DB_PORT`: Database port (default: `5432`)
- `DB_NAME`: Database name (default: `evmanager`)
- `DB_USERNAME`: Database username (default: `postgres`)
- `DB_PASSWORD`: Database password (default: `postgres`)
- `JWT_SECRET`: Secret key for JWT signing (needs to be Base64 encoded and securely generated).

Check `.env.example` for details.

## How to Run

1. Start the PostgreSQL database using Docker Compose:
```bash
cd backend
docker compose up -d
```
2. Navigate to the `backend` directory (if not already there).
3. Use Maven to run the application:
```bash
cd backend
mvn spring-boot:run
```

## How to Run Tests
```bash
mvn test
```

## Build Application
```bash
mvn clean package
```

## API Endpoints
- **Health Check**: `GET /api/health`
- **Swagger/OpenAPI UI**: `GET /swagger-ui.html`

## Backend Structure
```
backend/
├── pom.xml
├── README.md
├── .env.example
└── src/
    ├── main/
    │   ├── java/com/evmanager/
    │   │   ├── auth/
    │   │   ├── contracts/
    │   │   ├── customers/
    │   │   ├── dashboard/
    │   │   ├── events/
    │   │   ├── users/
    │   │   ├── venues/
    │   │   ├── controller/
    │   │   └── config/
    │   └── resources/
    │       ├── application.yml
    │       └── db/migration/
    └── test/
```
