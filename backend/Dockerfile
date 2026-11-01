# ==============================================================================
# Dockerfile cho EVManager Spring Boot Backend (Java 21 LTS)
# Multi-stage build tối ưu kích thước và tiết kiệm RAM cho Render Free Tier (512MB)
# ==============================================================================

# STAGE 1: Build source code bằng Maven
FROM maven:3.9.9-eclipse-temurin-21-alpine AS builder
WORKDIR /app

# Copy file định nghĩa phụ thuộc và tải cache
COPY pom.xml .
COPY src ./src

# Build file jar và bỏ qua test để tăng tốc độ deploy
RUN mvn clean package -DskipTests

# STAGE 2: Chạy ứng dụng bằng JRE Alpine siêu nhẹ
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Copy file jar từ builder
COPY --from=builder /app/target/backend-0.0.1-SNAPSHOT.jar app.jar

# Mặc định Spring Boot chạy cổng 8080 (Render tự động map cổng này)
ENV PORT=8080
EXPOSE 8080

# Cấu hình cờ JVM tối ưu cho môi trường RAM nhỏ (<512MB)
# - UseSerialGC: Thu gom rác đơn luồng nhẹ nhất, không tốn RAM
# - Xss512k: Giảm kích thước stack của thread
# - MaxRAMPercentage=75: Không bao giờ dùng quá 75% RAM được cấp
ENTRYPOINT ["java", "-XX:+UseSerialGC", "-Xss512k", "-XX:MaxRAMPercentage=75", "-jar", "app.jar"]
