package edu.ucaldas.hackathon.config;

import java.util.Arrays;
import java.util.LinkedHashSet;
import java.util.Set;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class AllowedOriginsProvider {

    private static final String DEFAULT_ALLOWED_ORIGINS =
            "http://localhost:5173,http://localhost:5174,https://red-wave-0ac496b0f.6.azurestaticapps.net";

    private final String[] allowedOrigins;

    public AllowedOriginsProvider(@Value("${app.allowed.origins:}") String rawAllowedOrigins) {
        final String source = rawAllowedOrigins == null || rawAllowedOrigins.isBlank()
                ? DEFAULT_ALLOWED_ORIGINS
                : rawAllowedOrigins;
        this.allowedOrigins = parseOrigins(source);
    }

    public String[] getAllowedOrigins() {
        return allowedOrigins;
    }

    private static String[] parseOrigins(String rawOrigins) {
        Set<String> origins = new LinkedHashSet<>();

        Arrays.stream(rawOrigins.split(","))
                .map(String::trim)
                .filter(origin -> !origin.isEmpty())
                .map(AllowedOriginsProvider::stripTrailingSlash)
                .forEach(origins::add);

        return origins.toArray(new String[0]);
    }

    private static String stripTrailingSlash(String origin) {
        if (origin.endsWith("/")) {
            return origin.substring(0, origin.length() - 1);
        }
        return origin;
    }
}