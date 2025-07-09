package com.example.vecinity.security;

import com.example.vecinity.dtos.AuthRequestDTO;
import com.example.vecinity.dtos.AuthResponseDTO;
import com.example.vecinity.model.User;
import com.example.vecinity.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Servicio que maneja los procesos de autenticación (login) y registro de usuarios.
 * Actúa como intermediario entre los controladores y los componentes de seguridad.
 */
@Service
public class AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UserService userService;

    /**
     * Autentica un usuario con sus credenciales y genera un token JWT.
     *
     * @param request DTO con email y contraseña del usuario
     * @return Respuesta con token JWT y datos básicos del usuario
     */
    public AuthResponseDTO authenticate(AuthRequestDTO request) {
        // Autenticar con usuario y contraseña
        // Si las credenciales son inválidas, lanzará AuthenticationException
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                request.getEmail(),
                request.getPassword()
            )
        );

        // Establecer el contexto de seguridad con el usuario autenticado
        SecurityContextHolder.getContext().setAuthentication(authentication);

        // Generar token JWT
        String jwt = jwtService.generateToken(authentication);

        // Obtener detalles del usuario autenticado
        User userDetails = (User) authentication.getPrincipal();

        // Extraer los roles del usuario (quitar prefijo "ROLE_")
        List<String> roles = userDetails.getAuthorities().stream()
                .map(item -> item.getAuthority().replace("ROLE_", ""))
                .collect(Collectors.toList());

        // Construir y devolver la respuesta con el token y datos del usuario
        return AuthResponseDTO.builder()
                .token(jwt)
                .id(userDetails.getId())
                .nombre(userDetails.getNombre())
                .email(userDetails.getEmail())
                .roles(roles)
                .build();
    }

    /**
     * Registra un nuevo usuario en el sistema.
     *
     * @param user Usuario a registrar con sus datos completos
     * @return Usuario registrado (con ID asignado)
     */
    public User register(User user) {
        // El UserService maneja la encriptación de contraseña y asignación de roles
        return userService.save(user);
    }
}
