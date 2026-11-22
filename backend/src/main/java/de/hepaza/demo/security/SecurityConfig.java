package de.hepaza.demo.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Value("${app.url}")
    private String appUrl;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // CSRF aus, sonst werden POST/PUT/DELETE vom Frontend abgelehnt
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(auth -> auth
                        // Health-Check bleibt offen (für Render und Tests)
                        .requestMatchers("/api/health").permitAll()
                        // Alle anderen API-Aufrufe nur mit Login
                        .requestMatchers("/api/**").authenticated()
                        // Frontend-Dateien (index.html, JS, CSS) frei, damit die Login-Seite lädt
                        .anyRequest().permitAll())
                // Nicht eingeloggt → 401 statt Weiterleitung zu GitHub (damit axios es erkennt)
                .exceptionHandling(e -> e
                        .authenticationEntryPoint(new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED)))
                // GitHub-Login unter /oauth2/authorization/github, danach zurück zum Frontend
                .oauth2Login(o -> o.defaultSuccessUrl(appUrl, true))
                // Abmelden per POST /api/auth/logout
                .logout(l -> l
                        .logoutUrl("/api/auth/logout")
                        .logoutSuccessHandler((request, response, authentication) ->
                                response.setStatus(HttpStatus.OK.value())));
        return http.build();
    }
}