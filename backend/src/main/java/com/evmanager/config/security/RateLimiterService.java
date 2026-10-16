package com.evmanager.config.security;

import org.springframework.stereotype.Service;

import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

@Service
public class RateLimiterService {

    private final RateLimiterProperties properties;
    private final ConcurrentHashMap<String, WindowBucket> buckets = new ConcurrentHashMap<>();
    private static final int MAX_BUCKETS = 10000;
    private static final long WINDOW_DURATION_MS = 60_000L;

    public RateLimiterService(RateLimiterProperties properties) {
        this.properties = properties;
    }

    public static class WindowBucket {
        volatile long windowStartMs;
        final AtomicInteger count;

        public WindowBucket(long windowStartMs, int initialCount) {
            this.windowStartMs = windowStartMs;
            this.count = new AtomicInteger(initialCount);
        }
    }

    public static class RateLimitResult {
        private final boolean allowed;
        private final int remaining;
        private final long retryAfterSeconds;

        public RateLimitResult(boolean allowed, int remaining, long retryAfterSeconds) {
            this.allowed = allowed;
            this.remaining = remaining;
            this.retryAfterSeconds = retryAfterSeconds;
        }

        public boolean isAllowed() {
            return allowed;
        }

        public int getRemaining() {
            return remaining;
        }

        public long getRetryAfterSeconds() {
            return retryAfterSeconds;
        }
    }

    public RateLimitResult checkRateLimit(String clientIp, String path, String method) {
        if (!properties.isEnabled()) {
            return new RateLimitResult(true, Integer.MAX_VALUE, 0);
        }

        // OPTIONS preflight requests do not consume API quota
        if ("OPTIONS".equalsIgnoreCase(method)) {
            return new RateLimitResult(true, Integer.MAX_VALUE, 0);
        }

        boolean isLogin = isLoginRoute(path, method);
        int limit = isLogin ? properties.getLoginLimitPerMinute() : properties.getDefaultLimitPerMinute();
        String key = (isLogin ? "login:" : "default:") + normalizeClientIp(clientIp);

        long now = System.currentTimeMillis();

        if (buckets.size() > 5000) {
            cleanupExpiredBuckets(now);
        }

        WindowBucket bucket = buckets.compute(key, (k, existing) -> {
            if (existing == null || (now - existing.windowStartMs) >= WINDOW_DURATION_MS) {
                if (existing == null && buckets.size() >= MAX_BUCKETS) {
                    cleanupExpiredBuckets(now);
                }
                return new WindowBucket(now, 1);
            } else {
                existing.count.incrementAndGet();
                return existing;
            }
        });

        int currentCount = bucket.count.get();
        if (currentCount <= limit) {
            return new RateLimitResult(true, Math.max(0, limit - currentCount), 0);
        } else {
            long elapsed = now - bucket.windowStartMs;
            long retryAfter = Math.max(1L, (WINDOW_DURATION_MS - elapsed + 999) / 1000L);
            return new RateLimitResult(false, 0, retryAfter);
        }
    }

    public void cleanupExpiredBuckets(long now) {
        buckets.entrySet().removeIf(entry -> (now - entry.getValue().windowStartMs) >= (WINDOW_DURATION_MS * 2));
    }

    public void reset() {
        buckets.clear();
    }

    public boolean isLoginRoute(String path, String method) {
        if (!"POST".equalsIgnoreCase(method)) {
            return false;
        }
        if (path == null) {
            return false;
        }
        String cleanPath = path;
        int queryIdx = cleanPath.indexOf('?');
        if (queryIdx >= 0) {
            cleanPath = cleanPath.substring(0, queryIdx);
        }
        int semiIdx = cleanPath.indexOf(';');
        if (semiIdx >= 0) {
            cleanPath = cleanPath.substring(0, semiIdx);
        }
        String normalized = cleanPath.endsWith("/") && cleanPath.length() > 1
                ? cleanPath.substring(0, cleanPath.length() - 1)
                : cleanPath;
        return "/api/v1/auth/login".equalsIgnoreCase(normalized) || "/api/auth/login".equalsIgnoreCase(normalized);
    }

    public String normalizeClientIp(String ip) {
        if (ip == null || ip.isBlank()) {
            return "unknown";
        }
        String trimmed = ip.trim();
        if (trimmed.contains(",")) {
            trimmed = trimmed.split(",")[0].trim();
        }
        if ("0:0:0:0:0:0:0:1".equals(trimmed) || "::1".equals(trimmed)) {
            return "127.0.0.1";
        }
        return trimmed;
    }
}
