# EVManager - Technical Stack

## 1. Tổng quan
Tài liệu này ghi nhận Tech Stack chính thức của dự án EVManager đã được nhóm thống nhất sau khi trao đổi giữa PM, BA và đội phát triển. Dự án được triển khai trên nền tảng Web + Desktop cho lĩnh vực quản lý dịch vụ sự kiện.

## 2. Frontend
Frontend hiện tại của hệ thống được xây dựng bằng các công nghệ cơ bản và thư viện giao diện, không sử dụng React:
- **HTML5**: Xây dựng cấu trúc các trang web.
- **CSS3**: Tùy chỉnh giao diện, bố cục, màu sắc, border-radius, box-shadow và các thành phần trình bày.
- **JavaScript**: Xử lý logic giao diện, dữ liệu mock, tương tác với HTML và gọi API Backend bằng `fetch()`.
- **Bootstrap 5**: Cung cấp Grid System, responsive layout và các UI component.
- **Chart.js**: Hiển thị biểu đồ thống kê, đặc biệt cho Dashboard và doanh thu.
- **FullCalendar**: Hiển thị lịch sự kiện và lịch tiệc trực quan.

## 3. Backend
Backend chính thức sử dụng hệ sinh thái Spring Boot của Java:
- **Java 21 LTS**: Ngôn ngữ lập trình chính.
- **Spring Boot**: Framework chính để xây dựng Backend.
- **Spring Web**: Xây dựng REST API.
- **Spring Data JPA + Hibernate**: ORM và truy cập dữ liệu PostgreSQL.
- **Flyway**: Quản lý Database Migration.
- **Jakarta Bean Validation**: Kiểm tra dữ liệu đầu vào.
- **Spring Security + JWT**: Authentication và Authorization.
- **Springdoc OpenAPI/Swagger**: Tài liệu và kiểm thử REST API.
- **Maven**: Quản lý dependency và build project.
- **JUnit 5 + Mockito + Spring Boot Test**: Testing.
- **SLF4J + Logback**: Logging.

## 4. Database
Cơ sở dữ liệu chính thức là **PostgreSQL**.
Lý do sử dụng:
- Database quan hệ mạnh mẽ, ổn định.
- Hỗ trợ transaction tốt.
- Hỗ trợ quan hệ dữ liệu phức tạp.
- Hỗ trợ kiểu dữ liệu JSON/JSONB.
- Phù hợp và tích hợp rất tốt với Spring Data JPA/Hibernate.

## 5. DevOps
Công cụ hỗ trợ phát triển, vận hành và triển khai:
- **Docker**: Container hóa ứng dụng.
- **Docker Compose**: Quản lý nhiều container trong môi trường dev/deploy.
- **GitHub Actions**: Hỗ trợ CI/CD.
- **Git**: Quản lý version control.
- **GitHub**: Lưu trữ mã nguồn và quản lý Pull Request, Issue.

## 6. Architecture
Kiến trúc tổng thể của hệ thống:

```text
HTML/CSS/JavaScript
        +
Bootstrap 5
        +
Chart.js
        +
FullCalendar
        |
        | fetch()
        v
Spring Boot REST API
        |
        +-- Spring Web
        +-- Spring Security + JWT
        +-- Spring Data JPA
        +-- Hibernate
        +-- Flyway
        |
        v
PostgreSQL
```

### Kiến trúc Backend
```text
Controller
    ↓
Service
    ↓
Repository
    ↓
Spring Data JPA / Hibernate
    ↓
PostgreSQL
```
- **Controller**: Nhận HTTP Request và trả HTTP Response.
- **Service**: Xử lý Business Logic.
- **Repository**: Truy cập dữ liệu thông qua Spring Data JPA.
- **Database**: PostgreSQL lưu trữ dữ liệu bền vững.

## 7. Development Tools
- IDE/Code Editor: IntelliJ IDEA, VS Code.
- API Client: Postman hoặc công cụ tích hợp trong IDE.
- DB Client: pgAdmin, DBeaver, hoặc DataGrip.
- Design: Figma (wireframe/prototype).

## 8. Technology Decision
Tech Stack chính thức đã được nhóm thống nhất.

**Frontend chính thức**: HTML5 + CSS3 + JavaScript + Bootstrap 5 + Chart.js + FullCalendar.  
**Backend chính thức**: Java 21 + Spring Boot + Spring Data JPA/Hibernate + PostgreSQL.

*Lưu ý quan trọng:* Các đề xuất trước đây sử dụng **NestJS, Node.js, Express, và Prisma** không còn là Tech Stack Backend chính thức của dự án. Không sử dụng các công nghệ này trong quy trình phát triển và vận hành hệ thống hiện tại.
