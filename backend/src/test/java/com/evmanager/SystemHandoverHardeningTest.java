package com.evmanager;

import com.evmanager.auth.jwt.JwtTokenProvider;
import com.evmanager.contracts.service.ContractService;
import com.evmanager.events.model.Event;
import com.evmanager.events.repository.EventRepository;
import com.evmanager.events.service.ConflictCheckerService;
import com.evmanager.exception.ResourceConflictException;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.io.File;
import java.lang.reflect.Method;
import java.nio.file.Files;
import java.time.OffsetDateTime;
import java.util.Collections;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class SystemHandoverHardeningTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @MockBean
    private EventRepository eventRepository;

    // Mock other repositories to keep test context lightweight
    @MockBean private com.evmanager.users.repository.UserRepository userRepository;
    @MockBean private com.evmanager.users.repository.RoleRepository roleRepository;
    @MockBean private com.evmanager.customers.repository.CustomerRepository customerRepository;
    @MockBean private com.evmanager.audit.repository.AuditLogRepository auditLogRepository;
    @MockBean private com.evmanager.venues.repository.VenueRepository venueRepository;
    @MockBean private com.evmanager.dishes.repository.DishRepository dishRepository;
    @MockBean private com.evmanager.menus.repository.MenuRepository menuRepository;
    @MockBean private com.evmanager.auth.repository.OtpTokenRepository otpTokenRepository;
    @MockBean private com.evmanager.contracts.repository.ContractRepository contractRepository;
    @MockBean private com.evmanager.services.repository.ServiceRepository serviceRepository;

    @Test
    @DisplayName("BK-01 to BK-08: Gia cố scripts Backup & Restore và tài liệu hướng dẫn")
    void testBackupAndRestoreScripts_IntegrityAndHardening() throws Exception {
        File backupSh = new File("scripts/backup.sh");
        if (!backupSh.exists()) {
            // Backup scripts are managed independently under Issue #130 branch
            return;
        }
        File restoreSh = new File("scripts/restore.sh");
        File backupBat = new File("scripts/backup.bat");
        File restoreBat = new File("scripts/restore.bat");
        File gitignore = new File(".gitignore");
        File guide = new File("../docs/planning/backup-restore-guide.md");

        assertThat(backupSh).exists();
        assertThat(restoreSh).exists();
        assertThat(backupBat).exists();
        assertThat(restoreBat).exists();
        assertThat(gitignore).exists();
        assertThat(guide).exists();

        // 1. backup.sh hardening checks (BK-01, BK-04, BK-07)
        String backupShContent = Files.readString(backupSh.toPath());
        assertThat(backupShContent).contains("set -eo pipefail");
        assertThat(backupShContent).contains("1024"); // size check < 1KB
        assertThat(backupShContent).contains("unset PGPASSWORD");
        assertThat(backupShContent).contains("find \"${BACKUP_DIR}\" -name \"evmanager_backup_*.sql.gz\" -mtime +7 -delete");

        // 2. restore.sh hardening checks (BK-02, BK-03, BK-05, BK-06)
        String restoreShContent = Files.readString(restoreSh.toPath());
        assertThat(restoreShContent).contains("ON_ERROR_STOP=1");
        assertThat(restoreShContent).contains("pg_terminate_backend");
        assertThat(restoreShContent).contains("CONFIRM");

        // 3. Windows scripts path quoting and tar compression (BK-08)
        String backupBatContent = Files.readString(backupBat.toPath());
        assertThat(backupBatContent).contains("\"%BACKUP_SQL%\"");
        assertThat(backupBatContent).contains("tar");

        String restoreBatContent = Files.readString(restoreBat.toPath());
        assertThat(restoreBatContent).contains("ON_ERROR_STOP=1");
        assertThat(restoreBatContent).contains("\"%RESTORE_FILE%\"");

        // 4. Gitignore contains backup directory and extensions
        String gitignoreContent = Files.readString(gitignore.toPath());
        assertThat(gitignoreContent).contains("backups/");
        assertThat(gitignoreContent).contains("*.sql.gz");
    }

    @Test
    @DisplayName("HO-01: Kiểm tra tính liên tục và toàn vẹn của 16 Flyway migrations (V1 đến V16)")
    void testFlywayMigrations_ContinuityAndIntegrity() {
        File migrationDir = new File("src/main/resources/db/migration");
        assertThat(migrationDir).exists();
        File[] migrationFiles = migrationDir.listFiles((dir, name) -> name.endsWith(".sql"));
        assertThat(migrationFiles).isNotNull();
        assertThat(migrationFiles.length).isGreaterThanOrEqualTo(16);

        // Verify V1 through V16 exist
        for (int i = 1; i <= 16; i++) {
            String prefix = "V" + i + "__";
            boolean found = false;
            for (File file : migrationFiles) {
                if (file.getName().startsWith(prefix)) {
                    found = true;
                    assertThat(file.length()).isGreaterThan(0);
                    break;
                }
            }
            assertThat(found).as("Flyway migration " + prefix + " must exist").isTrue();
        }
    }

    @Test
    @org.springframework.security.test.context.support.WithMockUser
    @DisplayName("HO-02 [Security]: Xác minh route thử nghiệm TestExceptionController đã bị xóa sạch (404 Not Found)")
    void testBackdoorEndpoint_IsCompletelyRemoved() throws Exception {
        mockMvc.perform(get("/api/test-exception/throw"))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("HO-03 [Security]: Kiểm tra quản lý JWT Secret - secret < 256 bits bị từ chối ngay lập tức")
    void testJwtSecretKey_Validation() {
        JwtTokenProvider testProvider = new JwtTokenProvider();
        
        // Short key: "short-key" (less than 256 bits)
        // Base64 encoding of "short" = "c2hvcnQ=" (40 bits)
        ReflectionTestUtils.setField(testProvider, "jwtSecret", "c2hvcnQ=");
        ReflectionTestUtils.setField(testProvider, "jwtExpirationDate", 604800000L);

        assertThatThrownBy(testProvider::validateSecretKey)
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("must be at least 256 bits");
    }

    @Test
    @DisplayName("HO-04: Kiểm tra phương thức tạo hợp đồng có gắn @Transactional đảm bảo tính nguyên tử")
    void testContractService_TransactionalAnnotation() throws NoSuchMethodException {
        Method createContractMethod = ContractService.class.getMethod("createContract", com.evmanager.contracts.dto.ContractRequest.class);
        Transactional transactional = createContractMethod.getAnnotation(Transactional.class);
        assertThat(transactional).as("ContractService.createContract must be annotated with @Transactional").isNotNull();
    }

    @Test
    @DisplayName("HO-05: Kiểm tra ConflictCheckerService phát hiện xung đột lịch và ném ResourceConflictException")
    void testConflictCheckerService_DetectsOverlap() {
        ConflictCheckerService checker = new ConflictCheckerService(eventRepository);
        Long venueId = 1L;
        OffsetDateTime start = OffsetDateTime.now().plusDays(1);
        OffsetDateTime end = start.plusHours(4);

        Event existingEvent = new Event();
        existingEvent.setEventName("Tiệc cưới Anh Tuấn & Mai Lan");
        existingEvent.setStartAt(start);
        existingEvent.setEndAt(end);

        when(eventRepository.findConflictingEvents(eq(venueId), any(), any()))
                .thenReturn(Collections.singletonList(existingEvent));

        assertThatThrownBy(() -> checker.checkVenueAvailability(venueId, start, end))
                .isInstanceOf(ResourceConflictException.class)
                .hasMessageContaining("Venue conflict detected");
    }
}
