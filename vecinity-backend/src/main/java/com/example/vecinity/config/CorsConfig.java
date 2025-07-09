package com.example.vecinity.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Configuración CORS (Cross-Origin Resource Sharing) para la aplicación.
 * Permite que el frontend acceda a los recursos del backend cuando están en dominios diferentes.
 * Sin esta configuración, el navegador bloquearía las peticiones desde un origen diferente
 * por razones de seguridad.
 */
@Configuration
public class CorsConfig {

    /**
     * Define la configuración CORS para toda la aplicación.
     *
     * @return WebMvcConfigurer con las reglas CORS aplicadas
     */
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**") // Aplica CORS a todos los endpoints
                        .allowedOrigins("http://localhost:5173", "http://localhost:3000") // Permite peticiones desde estos orígenes
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH") // Métodos HTTP permitidos
                        .allowedHeaders("*") // Permite cualquier cabecera
                        .allowCredentials(true) // Permite envío de cookies y cabeceras de autenticación
                        .maxAge(3600); // Cache preflight requests por 1 hora
            }
        };
    }
}
