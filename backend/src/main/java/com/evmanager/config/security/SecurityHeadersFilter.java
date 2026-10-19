package com.evmanager.config.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpServletResponseWrapper;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class SecurityHeadersFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        HttpServletResponseWrapper wrappedResponse = new HttpServletResponseWrapper(response) {
            @Override
            public void setHeader(String name, String value) {
                if ("X-Powered-By".equalsIgnoreCase(name) || "Server".equalsIgnoreCase(name)) {
                    return; // Suppress technology disclosure
                }
                super.setHeader(name, value);
            }

            @Override
            public void addHeader(String name, String value) {
                if ("X-Powered-By".equalsIgnoreCase(name) || "Server".equalsIgnoreCase(name)) {
                    return; // Suppress technology disclosure
                }
                super.addHeader(name, value);
            }
        };

        // Guarantee baseline security headers on all responses
        response.setHeader("X-Content-Type-Options", "nosniff");
        response.setHeader("X-Frame-Options", "DENY");
        response.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");

        filterChain.doFilter(request, wrappedResponse);
    }
}
