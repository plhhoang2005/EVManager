package com.evmanager;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.flyway.FlywayMigrationStrategy;
import org.springframework.context.annotation.Bean;

import java.net.URI;

@SpringBootApplication
public class EvmanagerApplication {

    public static void main(String[] args) {
        configureDatabaseProperties();
        SpringApplication.run(EvmanagerApplication.class, args);
    }

    private static void configureDatabaseProperties() {
        String rawUrl = System.getenv("SPRING_DATASOURCE_URL");
        if (rawUrl == null || rawUrl.isBlank()) {
            rawUrl = System.getenv("DATABASE_URL");
        }
        if (rawUrl == null || rawUrl.isBlank()) {
            return;
        }

        try {
            // Chuẩn hóa protocol để java.net.URI parse được
            String uriString = rawUrl.replaceFirst("^(jdbc:)?postgres(ql)?://", "http://");
            URI uri = new URI(uriString);

            String userInfo = uri.getUserInfo();
            if (userInfo != null && !userInfo.isBlank()) {
                String[] parts = userInfo.split(":", 2);
                if (parts.length > 0 && !parts[0].isBlank()) {
                    System.setProperty("spring.datasource.username", parts[0]);
                }
                if (parts.length > 1) {
                    System.setProperty("spring.datasource.password", parts[1]);
                }
            }

            String host = uri.getHost();
            int port = uri.getPort();
            String path = uri.getPath();
            String query = uri.getQuery();

            if (host != null) {
                StringBuilder jdbcUrl = new StringBuilder("jdbc:postgresql://").append(host);
                if (port > 0) {
                    jdbcUrl.append(":").append(port);
                }
                if (path != null && !path.isBlank()) {
                    jdbcUrl.append(path);
                }
                if (query != null && !query.isBlank()) {
                    jdbcUrl.append("?").append(query);
                }
                System.setProperty("spring.datasource.url", jdbcUrl.toString());
            } else if (!rawUrl.startsWith("jdbc:")) {
                System.setProperty("spring.datasource.url", "jdbc:" + rawUrl);
            }
        } catch (Exception e) {
            if (!rawUrl.startsWith("jdbc:")) {
                if (rawUrl.startsWith("postgres://")) {
                    System.setProperty("spring.datasource.url", "jdbc:postgresql://" + rawUrl.substring("postgres://".length()));
                } else {
                    System.setProperty("spring.datasource.url", "jdbc:" + rawUrl);
                }
            }
        }
    }

    @Bean
    public FlywayMigrationStrategy flywayMigrationStrategy() {
        return flyway -> {
            flyway.repair();
            flyway.migrate();
        };
    }
}
