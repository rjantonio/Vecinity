package com.example.vecinity.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * Filtro que intercepta todas las solicitudes HTTP para validar tokens JWT.
 * Se ejecuta una vez por cada petición antes de llegar al controlador.
 */
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    public JwtAuthenticationFilter(JwtService jwtService, UserDetailsService userDetailsService) {
        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {
        // Obtener el header de autorización que contiene el token JWT
        final String authHeader = request.getHeader("Authorization");

        // Si no hay token o no es de tipo Bearer, continuar con la cadena de filtros
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
            // Extraer el token JWT (quitar el prefijo "Bearer ")
            final String jwt = authHeader.substring(7);

            // Extraer el email del usuario desde el token
            final String userEmail = jwtService.extractUsername(jwt);

            // Si hay un email y el usuario no está ya autenticado
            if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                // Cargar los detalles del usuario desde la base de datos
                UserDetails userDetails = this.userDetailsService.loadUserByUsername(userEmail);

                // Validar el token
                if (jwtService.validateToken(jwt, userDetails)) {
                    // Si el token es válido, crear un objeto de autenticación
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userDetails, null, userDetails.getAuthorities());

                    // Añadir detalles de la petición al objeto de autenticación
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                    // Establecer la autenticación en el contexto de seguridad
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            }
        } catch (Exception e) {
            // Si hay algún problema con el token, simplemente continuamos sin autenticar
            // No se lanza excepción para evitar que las peticiones se bloqueen por problemas con el token
        }

        // Continuar con la cadena de filtros
        filterChain.doFilter(request, response);
    }
}
