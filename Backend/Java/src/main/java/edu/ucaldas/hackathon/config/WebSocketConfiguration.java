package edu.ucaldas.hackathon.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableScheduling
@EnableWebSocketMessageBroker
public class WebSocketConfiguration implements WebSocketMessageBrokerConfigurer {

    private final AllowedOriginsProvider allowedOriginsProvider;

    public WebSocketConfiguration(AllowedOriginsProvider allowedOriginsProvider) {
        this.allowedOriginsProvider = allowedOriginsProvider;
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        registry.enableSimpleBroker("/topic");
        registry.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        String[] allowedOrigins = allowedOriginsProvider.getAllowedOrigins();

        // Keep plain WebSocket endpoint for existing STOMP clients.
        registry.addEndpoint("/ws")
                .setAllowedOrigins(allowedOrigins);

        // Also expose SockJS fallback for broader browser compatibility.
        registry.addEndpoint("/ws")
                .setAllowedOrigins(allowedOrigins)
                .withSockJS();
    }
}
