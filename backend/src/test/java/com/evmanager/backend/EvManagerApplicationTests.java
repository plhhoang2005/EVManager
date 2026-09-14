package com.evmanager.backend;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@ActiveProfiles("test")
@SpringBootTest
class EvManagerApplicationTests {

    @Test
    void contextLoads() {
        // Spring Boot Test xác nhận skeleton có thể khởi tạo ApplicationContext.
    }
}
