package com.evmanager.config.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@Component
public class RateLimitingFilter extends OncePerRequestFilter {

    private final RateLimiterService rateLimiterService;
    private final RateLimiterProperties rateLimiterProperties;
    private final CorsProperties corsProperties;
    private final ObjectMapper objectMapper;

    public RateLimitingFilter(RateLimiterService rateLimiterService,
                              RateLimiterProperties rateLimiterProperties,
                              CorsProperties corsProperties,
                              ObjectMapper objectMapper) {
        this.rateLimiterService = rateLimiterService;
        this.rateLimiterProperties = rateLimiterProperties;
        this.corsProperties = corsProperties;
        this.objectMapper = objectMapper;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        String clientIp = resolveClientIp(request);
        String path = request.getRequestURI();
        String method = request.getMethod();

        RateLimiterService.RateLimitResult result = rateLimiterService.checkRateLimit(clientIp, path, method);

        if (!result.isAllowed()) {
            writeRateLimitResponse(request, response, result);
            return;
        }

        filterChain.doFilter(request, response);
    }

    private void writeRateLimitResponse(HttpServletRequest request,
                                        HttpServletResponse response,
                                        RateLimiterService.RateLimitResult result) throws IOException {
        response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
        response.setHeader("Retry-After", String.valueOf(result.getRetryAfterSeconds()));
        response.setHeader("X-Content-Type-Options", "nosniff");
        response.setHeader("X-Frame-Options", "DENY");
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding("UTF-8");

        String origin = request.getHeader("Origin");
        if (origin != null && corsProperties.isOriginAllowed(origin)) {
            response.setHeader("Access-Control-Allow-Origin", origin);
            response.setHeader("Vary", "Origin");
            if (corsProperties.isAllowCredentials()) {
                response.setHeader("Access-Control-Allow-Credentials", "true");
            }
        }

        Map<String, Object> errorDetails = new HashMap<>();
        errorDetails.put("timestamp", Instant.now().toString());
        errorDetails.put("status", HttpStatus.TOO_MANY_REQUESTS.value());
        errorDetails.put("error", "Too Many Requests");
        errorDetails.put("message", "Quá nhiều yêu cầu. Vui lòng thử lại sau " + result.getRetryAfterSeconds() + " giây.");
        errorDetails.put("path", request.getRequestURI());

        response.getWriter().write(objectMapper.writeValueAsString(errorDetails));
    }

    private String resolveClientIp(HttpServletRequest request) {
        if (rateLimiterProperties.isTrustForwardedHeaders()) {
            String forwarded = request.getHeader("X-Forwarded-For");
            if (forwarded != null && !forwarded.isBlank()) {
                String[] ips = forwarded.split(",");
                if (ips.length > 0 && !ips[0].trim().isBlank()) {
                    return ips[0].trim();
                }
            }
        }
        return request.getRemoteAddr();
    }
}
