package com.example.vecinity.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SignatureException;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;

/**
 * Servicio que maneja la creación y validación de tokens JWT (JSON Web Token).
 * JWT permite implementar autenticación sin estado (stateless) en la aplicación.
 */
@Service
public class JwtService {

    // Clave secreta definida en application.properties
    @Value("${jwt.secret}")
    private String secretKey;

    // Tiempo de expiración del token en milisegundos
    @Value("${jwt.expiration}")
    private long jwtExpiration;

    // La clave criptográfica usada para firmar y verificar tokens
    private Key key;

    /**
     * Inicializa la clave criptográfica a partir de la clave secreta.
     * Este método se ejecuta después de la inyección de dependencias.
     */
    @PostConstruct
    public void init() {
        this.key = Keys.hmacShaKeyFor(secretKey.getBytes());
    }

    /**
     * Genera un token JWT para un usuario autenticado.
     *
     * @param authentication Objeto de autenticación con los detalles del usuario
     * @return Token JWT generado
     */
    public String generateToken(Authentication authentication) {
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();

        return Jwts.builder()
                .setSubject(userDetails.getUsername()) // El email del usuario
                .setIssuedAt(new Date())               // Fecha de emisión
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpiration)) // Fecha de expiración
                .signWith(key, SignatureAlgorithm.HS256) // Firma con algoritmo HS256
                .compact();
    }

    /**
     * Extrae el nombre de usuario (email) del token JWT.
     *
     * @param token Token JWT
     * @return Email del usuario
     */
    public String extractUsername(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    /**
     * Verifica si el token es válido para un usuario específico.
     *
     * @param token Token JWT a validar
     * @param userDetails Detalles del usuario
     * @return true si el token es válido, false en caso contrario
     */
    public boolean validateToken(String token, UserDetails userDetails) {
        try {
            final String username = extractUsername(token);
            return username.equals(userDetails.getUsername()) && !isTokenExpired(token);
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Valida la estructura y firma del token, sin verificar el usuario.
     *
     * @param token Token JWT a validar
     * @return true si el token tiene formato válido y firma correcta
     */
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
            return true;
        } catch (SignatureException | MalformedJwtException | ExpiredJwtException | UnsupportedJwtException | IllegalArgumentException e) {
            return false;
        }
    }

    /**
     * Verifica si el token ha expirado.
     */
    private boolean isTokenExpired(String token) {
        final Date expiration = extractExpiration(token);
        return expiration.before(new Date());
    }

    /**
     * Extrae la fecha de expiración del token.
     */
    private Date extractExpiration(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getExpiration();
    }
}
