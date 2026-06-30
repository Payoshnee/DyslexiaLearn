package com.example.DyslexiLearn.config;

import java.net.URI;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.env.EnvironmentPostProcessor;
import org.springframework.core.Ordered;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.MapPropertySource;

public class RenderDatabaseUrlProcessor implements EnvironmentPostProcessor, Ordered {

    @Override
    public void postProcessEnvironment(ConfigurableEnvironment environment, SpringApplication application) {
        String rawUrl = firstPresent(
                environment.getProperty("DATABASE_URL"),
                environment.getProperty("DB_URL")
        );

        if (rawUrl == null || rawUrl.isBlank()) {
            return;
        }

        DatabaseSettings settings = parseRenderUrl(rawUrl);
        if (settings == null) {
            return;
        }

        Map<String, Object> properties = new HashMap<>();
        properties.put("spring.datasource.url", settings.jdbcUrl());
        properties.put("spring.datasource.username", settings.username());
        properties.put("spring.datasource.password", settings.password());

        environment.getPropertySources().addFirst(new MapPropertySource("renderDatabaseUrl", properties));
    }

    @Override
    public int getOrder() {
        return Ordered.HIGHEST_PRECEDENCE;
    }

    private static String firstPresent(String first, String second) {
        return first != null && !first.isBlank() ? first : second;
    }

    private static DatabaseSettings parseRenderUrl(String rawUrl) {
        try {
            String normalized = rawUrl;
            if (normalized.startsWith("jdbc:postgresql://")) {
                normalized = "postgresql://" + normalized.substring("jdbc:postgresql://".length());
            }
            if (!normalized.startsWith("postgresql://") && !normalized.startsWith("postgres://")) {
                return null;
            }

            URI uri = URI.create(normalized);
            String userInfo = uri.getRawUserInfo();
            if (userInfo == null || !userInfo.contains(":")) {
                return null;
            }

            String[] credentials = userInfo.split(":", 2);
            String username = decode(credentials[0]);
            String password = decode(credentials[1]);
            String database = uri.getPath() == null ? "" : uri.getPath();
            String query = uri.getRawQuery() == null ? "" : "?" + uri.getRawQuery();
            int port = uri.getPort();

            String jdbcUrl = "jdbc:postgresql://" + uri.getHost()
                    + (port > 0 ? ":" + port : "")
                    + database
                    + query;

            return new DatabaseSettings(jdbcUrl, username, password);
        } catch (RuntimeException ex) {
            return null;
        }
    }

    private static String decode(String value) {
        return URLDecoder.decode(value, StandardCharsets.UTF_8);
    }

    private record DatabaseSettings(String jdbcUrl, String username, String password) {
    }
}
