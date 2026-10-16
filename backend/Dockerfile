# ==============================================================================
# Multi-stage Dockerfile for EVManager Spring Boot Backend (Java 21)
# ==============================================================================

# Stage 1: Build & Package
FROM eclipse-temurin:21-jdk-jammy AS builder
WORKDIR /workspace

# Copy build descriptor and wrapper
COPY .mvn/ .mvn/
COPY mvnw pom.xml ./
RUN sed -i 's/\r$//' mvnw && chmod +x mvnw && ./mvnw dependency:go-offline -B || true

# Copy source code and build jar
COPY src ./src
RUN ./mvnw clean package -DskipTests -B

# Stage 2: Minimal Secure Runtime
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app

# Run as non-root user for container security
RUN groupadd -r spring && useradd -r -g spring spring
USER spring:spring

# Copy built artifact
COPY --from=builder --chown=spring:spring /workspace/target/*.jar app.jar

# Configuration defaults
ENV PORT=8080 \
    SPRING_PROFILES_ACTIVE=staging \
    TZ=UTC \
    JAVA_TOOL_OPTIONS="-XX:+UseG1GC -XX:MaxRAMPercentage=75.0 -Djava.security.egd=file:/dev/./urandom"

EXPOSE 8080

ENTRYPOINT ["sh", "-c", "java $JAVA_TOOL_OPTIONS -jar app.jar"]
