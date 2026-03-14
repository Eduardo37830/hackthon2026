package edu.ucaldas.hackathon.infra.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfiguration {

    @Autowired
    private SecurityFilter securityFilter; 

    /**
     * Configures the security filter chain for the application.
     * <p>
     * - Disables CSRF protection.
     * - Allows unauthenticated access to the "/login" endpoint.
     * - Allows unauthenticated POST requests to "/user" for user registration.
     * - Restricts POST requests to "/review/house" to users with "ROLE_ADMIN" or
     * "ROLE_CLIENT".
     * - Restricts POST requests to "/house/**" to users with "ROLE_ADMIN" or
     * "ROLE_OWNER".
     * - Restricts POST requests to "/rent" to users with "ROLE_ADMIN" or
     * "ROLE_OWNER".
     * - Restricts PUT requests to "/rent/accept" to users with "ROLE_ADMIN" or
     * "ROLE_CLIENT".
     * - Restricts DELETE requests to "/rent" to users with "ROLE_ADMIN" or
     * "ROLE_OWNER".
     * - Restricts GET requests to "/rent/client" to users with "ROLE_ADMIN" or
     * "ROLE_CLIENT".
     * - Restricts GET requests to "/rent/owener" to users with "ROLE_ADMIN" or
     * "ROLE_OWNER".
     * - Requires authentication for all other requests.
     * - Configures the session management to be stateless.
     * - Adds a custom security filter before the
     * UsernamePasswordAuthenticationFilter.
     *
     * @param http the {@link HttpSecurity} to modify
     * @return the configured {@link SecurityFilterChain}
     * @throws Exception if an error occurs during configuration
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http.cors().and().csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> {
                    auth.requestMatchers("/login").permitAll();
                    auth.requestMatchers(HttpMethod.POST, "/user").permitAll();
                    auth.requestMatchers(HttpMethod.POST, "/review/house").hasAnyAuthority("ROLE_ADMIN", "ROLE_CLIENT");
                    auth.requestMatchers(HttpMethod.POST, "/house/**").hasAnyAuthority("ROLE_ADMIN", "ROLE_OWNER");
                    auth.requestMatchers(HttpMethod.POST, "/rent").hasAnyAuthority("ROLE_ADMIN", "ROLE_OWNER");
                    auth.requestMatchers(HttpMethod.PUT, "/rent/accept").hasAnyAuthority("ROLE_ADMIN", "ROLE_CLIENT");
                    auth.requestMatchers(HttpMethod.DELETE, "/rent").hasAnyAuthority("ROLE_ADMIN", "ROLE_OWNER");
                    auth.requestMatchers(HttpMethod.GET, "/rent/client").hasAnyAuthority("ROLE_ADMIN", "ROLE_CLIENT");
                    auth.requestMatchers(HttpMethod.GET, "/rent/owener").hasAnyAuthority("ROLE_ADMIN", "ROLE_OWNER");
                    auth.anyRequest().authenticated();
                })
                .sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilterBefore(securityFilter, UsernamePasswordAuthenticationFilter.class).build(); // filter
    }

    /**
     * Exposes the {@link AuthenticationManager} bean to be used for authentication
     * processes.
     * 
     * @param authenticationConfiguration the configuration object that provides the
     *                                    authentication manager
     * @return the {@link AuthenticationManager} instance
     * @throws Exception if an error occurs while retrieving the authentication
     *                   manager
     */
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration)
            throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    /**
     * Defines a {@link PasswordEncoder} bean that uses the BCrypt hashing
     * algorithm.
     * <p>
     * BCrypt is a strong and adaptive hashing function recommended for securely
     * storing passwords.
     * This bean can be injected wherever password encoding or verification is
     * required.
     *
     * @return a {@link BCryptPasswordEncoder} instance for password hashing and
     *         verification
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
