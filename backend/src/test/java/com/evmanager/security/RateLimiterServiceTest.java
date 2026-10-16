package com.evmanager.security;

import com.evmanager.config.security.RateLimiterProperties;
import com.evmanager.config.security.RateLimiterService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.atomic.AtomicInteger;

import static org.junit.jupiter.api.Assertions.*;

public class RateLimiterServiceTest {

    private RateLimiterService rateLimiterService;
    private RateLimiterProperties properties;

    @BeforeEach
    void setUp() {
        properties = new RateLimiterProperties();
        properties.setEnabled(true);
        properties.setDefaultLimitPerMinute(10);
        properties.setLoginLimitPerMinute(3);
        properties.setTrustForwardedHeaders(false);

        rateLimiterService = new RateLimiterService(properties);
        rateLimiterService.reset();
    }

    @Test
    @DisplayName("C01 & C06: Requests under limit should be allowed")
    void testUnderLimitAllowed() {
        String ip = "192.168.1.10";
        for (int i = 0; i < 10; i++) {
            RateLimiterService.RateLimitResult result = rateLimiterService.checkRateLimit(ip, "/api/v1/venues", "GET");
            assertTrue(result.isAllowed(), "Request " + (i + 1) + " should be allowed");
            assertEquals(10 - (i + 1), result.getRemaining());
        }
    }

    @Test
    @DisplayName("C03: Requests exceeding general limit should be rejected with 429")
    void testGeneralLimitExceeded() {
        String ip = "192.168.1.11";
        for (int i = 0; i < 10; i++) {
            assertTrue(rateLimiterService.checkRateLimit(ip, "/api/v1/venues", "GET").isAllowed());
        }

        // 11th request exceeds limit
        RateLimiterService.RateLimitResult result = rateLimiterService.checkRateLimit(ip, "/api/v1/venues", "GET");
        assertFalse(result.isAllowed(), "11th request must be rejected");
        assertEquals(0, result.getRemaining());
        assertTrue(result.getRetryAfterSeconds() > 0 && result.getRetryAfterSeconds() <= 60);
    }

    @Test
    @DisplayName("C04 & C05: Login route applies strict 3 req/min limit")
    void testLoginStrictLimit() {
        String ip = "192.168.1.12";
        // 3 login requests allowed
        for (int i = 0; i < 3; i++) {
            RateLimiterService.RateLimitResult res = rateLimiterService.checkRateLimit(ip, "/api/v1/auth/login", "POST");
            assertTrue(res.isAllowed(), "Login attempt " + (i + 1) + " should be allowed");
        }

        // 4th login request rejected
        RateLimiterService.RateLimitResult rejected = rateLimiterService.checkRateLimit(ip, "/api/v1/auth/login", "POST");
        assertFalse(rejected.isAllowed(), "4th login attempt must be rejected");
        assertTrue(rejected.getRetryAfterSeconds() > 0);
    }

    @Test
    @DisplayName("C09 & E02: Different IPs have independent quotas")
    void testIndependentIps() {
        String ipA = "10.0.0.1";
        String ipB = "10.0.0.2";

        // Exhaust quota for ipA
        for (int i = 0; i < 3; i++) {
            assertTrue(rateLimiterService.checkRateLimit(ipA, "/api/v1/auth/login", "POST").isAllowed());
        }
        assertFalse(rateLimiterService.checkRateLimit(ipA, "/api/v1/auth/login", "POST").isAllowed());

        // ipB should still be allowed
        assertTrue(rateLimiterService.checkRateLimit(ipB, "/api/v1/auth/login", "POST").isAllowed(),
                "ipB must not be blocked when ipA exceeds quota");
    }

    @Test
    @DisplayName("C13: OPTIONS preflight does not consume quota")
    void testOptionsPreflightNoQuotaConsumption() {
        String ip = "10.0.0.5";
        for (int i = 0; i < 20; i++) {
            RateLimiterService.RateLimitResult res = rateLimiterService.checkRateLimit(ip, "/api/v1/auth/login", "OPTIONS");
            assertTrue(res.isAllowed(), "OPTIONS preflight must always be allowed");
        }

        // Login quota should still be fully available
        RateLimiterService.RateLimitResult loginRes = rateLimiterService.checkRateLimit(ip, "/api/v1/auth/login", "POST");
        assertTrue(loginRes.isAllowed());
        assertEquals(2, loginRes.getRemaining()); // 3 - 1 = 2
    }

    @Test
    @DisplayName("E01: Concurrency thread safety under high load")
    void testConcurrentRequestsThreadSafety() throws InterruptedException {
        String ip = "10.0.0.99";
        int threadCount = 20;
        int requestsPerThread = 5;
        // Total attempts: 100, limit: 10
        ExecutorService executor = Executors.newFixedThreadPool(threadCount);
        CountDownLatch latch = new CountDownLatch(threadCount);
        AtomicInteger allowedCount = new AtomicInteger(0);
        AtomicInteger rejectedCount = new AtomicInteger(0);

        for (int i = 0; i < threadCount; i++) {
            executor.submit(() -> {
                try {
                    for (int j = 0; j < requestsPerThread; j++) {
                        RateLimiterService.RateLimitResult res = rateLimiterService.checkRateLimit(ip, "/api/v1/venues", "GET");
                        if (res.isAllowed()) {
                            allowedCount.incrementAndGet();
                        } else {
                            rejectedCount.incrementAndGet();
                        }
                    }
                } finally {
                    latch.countDown();
                }
            });
        }

        latch.await();
        executor.shutdown();

        assertEquals(10, allowedCount.get(), "Exactly 10 requests must be allowed under concurrent load");
        assertEquals(90, rejectedCount.get(), "Remaining 90 requests must be rejected under concurrent load");
    }

    @Test
    @DisplayName("E12 & E13: IP Normalization handles IPv6 localhost, whitespace, and comma-separated IPs")
    void testIpNormalization() {
        assertEquals("127.0.0.1", rateLimiterService.normalizeClientIp("0:0:0:0:0:0:0:1"));
        assertEquals("127.0.0.1", rateLimiterService.normalizeClientIp("::1"));
        assertEquals("192.168.1.1", rateLimiterService.normalizeClientIp("  192.168.1.1  "));
        assertEquals("198.51.100.1", rateLimiterService.normalizeClientIp("198.51.100.1, 10.0.0.1, 172.16.0.1"));
        assertEquals("unknown", rateLimiterService.normalizeClientIp(null));
        assertEquals("unknown", rateLimiterService.normalizeClientIp("   "));
    }

    @Test
    @DisplayName("J04 & J06: Exotic login path variations (trailing slash, query params, matrix params, casing) are correctly identified")
    void testExoticLoginRouteVariations() {
        assertTrue(rateLimiterService.isLoginRoute("/api/v1/auth/login", "POST"));
        assertTrue(rateLimiterService.isLoginRoute("/api/v1/auth/login/", "POST"));
        assertTrue(rateLimiterService.isLoginRoute("/api/v1/auth/login?param=evil&redirect=/home", "POST"));
        assertTrue(rateLimiterService.isLoginRoute("/api/v1/auth/login;jsessionid=123456", "POST"));
        assertTrue(rateLimiterService.isLoginRoute("/API/V1/AUTH/LOGIN", "POST"));
        assertTrue(rateLimiterService.isLoginRoute("/api/v1/auth/login", "post")); // lowercase method

        // Negative cases
        assertFalse(rateLimiterService.isLoginRoute("/api/v1/auth/login", "GET"));
        assertFalse(rateLimiterService.isLoginRoute("/api/v1/auth/register", "POST"));
        assertFalse(rateLimiterService.isLoginRoute("/api/v1/auth/login/extra", "POST"));
        assertFalse(rateLimiterService.isLoginRoute(null, "POST"));
    }

    @Test
    @DisplayName("D11: Disabled rate limiter bypasses counting and allows all requests")
    void testRateLimiterDisabled() {
        properties.setEnabled(false);
        RateLimiterService.RateLimitResult res = rateLimiterService.checkRateLimit("1.2.3.4", "/api/v1/auth/login", "POST");
        assertTrue(res.isAllowed());
        assertEquals(Integer.MAX_VALUE, res.getRemaining());
        assertEquals(0, res.getRetryAfterSeconds());
    }
}
