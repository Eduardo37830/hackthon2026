package edu.ucaldas.hackathon.infra.springdoc;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
/**
 * SpringDocConfiguration sets up the OpenAPI documentation for the application.
 * <p>
 * This configuration class defines a bean that customizes the OpenAPI specification
 * by adding a JWT Bearer authentication security scheme. The security scheme is
 * registered under the name "bearer-key" and specifies the use of HTTP bearer
 * authentication with JWT as the bearer format.
 * </p>
 *
 * <p>
 * This configuration enables API documentation tools (such as Swagger UI)
 * to recognize and describe the JWT Bearer authentication mechanism,
 * facilitating secure API exploration and testing.
 * </p>
 *
 * @author juan-manoel
 */
@Configuration
public class SpringDocConfiguration {
/**
 * Configures the OpenAPI documentation for the application.
 * <p>
 * This bean customizes the OpenAPI specification by adding a security scheme
 * for JWT Bearer authentication. The security scheme is named "bearer-key"
 * and uses the HTTP bearer authentication type with JWT as the bearer format.
 *
 * @return a customized {@link OpenAPI} instance with JWT bearer security scheme.
 */
    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .components(new Components()
                        .addSecuritySchemes("bearer-key",
                                new SecurityScheme().type(SecurityScheme.Type.HTTP).scheme("bearer")
                                        .bearerFormat("JWT")));
    }
}
