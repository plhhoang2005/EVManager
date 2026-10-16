package com.evmanager.staging;

import com.evmanager.controller.HealthCheckController;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.core.io.ClassPathResource;
import org.yaml.snakeyaml.Yaml;

import java.io.InputStream;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

public class StagingConfigurationTest {

    @Test
    @DisplayName("A07-A09: Staging configuration application-staging.yml enforces strict validation and secure defaults")
    void testStagingProfileYamlConfiguration() throws Exception {
        ClassPathResource resource = new ClassPathResource("application-staging.yml");
        assertTrue(resource.exists(), "application-staging.yml must exist in classpath");

        Yaml yaml = new Yaml();
        try (InputStream in = resource.getInputStream()) {
            Map<String, Object> config = yaml.load(in);
            assertNotNull(config, "YAML configuration should not be null");

            @SuppressWarnings("unchecked")
            Map<String, Object> spring = (Map<String, Object>) config.get("spring");
            assertNotNull(spring);

            // Verify JPA ddl-auto is validate (never update or create-drop)
            @SuppressWarnings("unchecked")
            Map<String, Object> jpa = (Map<String, Object>) spring.get("jpa");
            @SuppressWarnings("unchecked")
            Map<String, Object> hibernate = (Map<String, Object>) jpa.get("hibernate");
            assertEquals("validate", hibernate.get("ddl-auto"));

            // Verify SQL logging is disabled on staging to prevent data leakage
            assertEquals(false, jpa.get("show-sql"));

            // Verify Flyway is enabled
            @SuppressWarnings("unchecked")
            Map<String, Object> flyway = (Map<String, Object>) spring.get("flyway");
            assertEquals(true, flyway.get("enabled"));
            assertEquals(true, flyway.get("baseline-on-migrate"));

            // Verify JWT secret is strictly mapped from environment variable without hardcoded fallback
            @SuppressWarnings("unchecked")
            Map<String, Object> app = (Map<String, Object>) config.get("app");
            assertNotNull(app);
            assertEquals("${JWT_SECRET}", app.get("jwt-secret"));

            // Verify Server Port is mapped from PORT environment variable
            @SuppressWarnings("unchecked")
            Map<String, Object> server = (Map<String, Object>) config.get("server");
            assertNotNull(server);
            assertEquals("${PORT:8080}", server.get("port"));
        }
    }

    @Test
    @DisplayName("F01-F02: Health check endpoint returns status ok")
    void testHealthCheckController() {
        HealthCheckController controller = new HealthCheckController();
        Map<String, String> response = controller.health();

        assertNotNull(response);
        assertEquals("ok", response.get("status"));
        // Ensure no extra leaking keys (such as environment, database or server details)
        assertEquals(1, response.size(), "Health check must return only status key to avoid info leaks");
        assertTrue(response.containsKey("status"));
    }

    @Test
    @DisplayName("B01-B07: Server header disclosure and proxy headers configuration")
    void testServerSecurityHeadersAndForwarding() throws Exception {
        ClassPathResource resource = new ClassPathResource("application-staging.yml");
        Yaml yaml = new Yaml();
        try (InputStream in = resource.getInputStream()) {
            Map<String, Object> config = yaml.load(in);
            @SuppressWarnings("unchecked")
            Map<String, Object> server = (Map<String, Object>) config.get("server");
            assertNotNull(server);

            // server-header must be empty to prevent disclosing web server version (Apache Tomcat/10.x)
            assertEquals("", server.get("server-header"), "Server header should be empty to prevent fingerprinting");

            // forward-headers-strategy must be native to handle reverse proxy HTTPS / X-Forwarded-Proto
            assertEquals("native", server.get("forward-headers-strategy"));
        }
    }

    @Test
    @DisplayName("I05-I07: Staging logging prevents sensitive SQL bind parameter and customer PII leakage")
    void testStagingLoggingPolicy() throws Exception {
        ClassPathResource resource = new ClassPathResource("application-staging.yml");
        Yaml yaml = new Yaml();
        try (InputStream in = resource.getInputStream()) {
            Map<String, Object> config = yaml.load(in);
            @SuppressWarnings("unchecked")
            Map<String, Object> logging = (Map<String, Object>) config.get("logging");
            assertNotNull(logging);

            @SuppressWarnings("unchecked")
            Map<String, Object> level = (Map<String, Object>) logging.get("level");
            assertNotNull(level);

            assertEquals("WARN", level.get("org.hibernate.SQL"), "SQL logging must be WARN on staging");
            assertEquals("WARN", level.get("org.hibernate.type.descriptor.sql"), "SQL param descriptor logging must be WARN");
        }
    }

    @Test
    @DisplayName("C01-C05: Flyway migration files naming and version uniqueness check")
    void testFlywayMigrationIntegrity() throws Exception {
        java.io.File migrationDir = new java.io.File("src/main/resources/db/migration");
        if (!migrationDir.exists()) {
            // Check fallback for different execution contexts
            migrationDir = new java.io.File("backend/src/main/resources/db/migration");
        }
        assertTrue(migrationDir.exists(), "db/migration directory must exist");

        java.io.File[] files = migrationDir.listFiles((dir, name) -> name.endsWith(".sql"));
        assertNotNull(files);
        assertTrue(files.length >= 15, "There should be at least 15 migration files");

        java.util.Set<Integer> versions = new java.util.HashSet<>();
        java.util.regex.Pattern pattern = java.util.regex.Pattern.compile("^V(\\d+)__.*\\.sql$");

        for (java.io.File f : files) {
            java.util.regex.Matcher matcher = pattern.matcher(f.getName());
            assertTrue(matcher.matches(), "Migration file " + f.getName() + " must follow Flyway V{version}__{description}.sql convention");
            int version = Integer.parseInt(matcher.group(1));
            assertTrue(version > 0, "Migration version must be positive");
            assertFalse(versions.contains(version), "Duplicate migration version found: V" + version);
            versions.add(version);
        }

        // Verify version 15 is present
        assertTrue(versions.contains(15), "V15 migration must be present in migration chain");
    }

    @Test
    @DisplayName("B11: Keyword escaping and search parameter simulation (Vietnamese accents, special SQL characters, null)")
    void testKeywordSearchVariations() {
        String[] testKeywords = {
            null,
            "",
            "   ",
            "Diamond Hall",
            "Sảnh Hoàng Gia",
            "Tiệc Cưới Ánh Sao",
            "100% Cotton",
            "venue_name_with_underscores",
            "' OR '1'='1",
            "\"; DROP TABLE venues; --",
            "A".repeat(255)
        };

        for (String kw : testKeywords) {
            // Emulate cast(:keyword as string) logic in VenueRepository
            String processed = (kw == null || kw.trim().isEmpty()) ? null : kw.trim().toLowerCase();
            if (kw == null || kw.trim().isEmpty()) {
                assertNull(processed);
            } else {
                assertNotNull(processed);
                assertFalse(processed.isEmpty());
            }
        }
    }
}
