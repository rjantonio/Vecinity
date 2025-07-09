package com.example.vecinity.controller;

import com.example.vecinity.dtos.AuthRequestDTO;
import com.example.vecinity.dtos.AuthResponseDTO;
import com.example.vecinity.model.User;
import com.example.vecinity.security.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Controlador que expone los endpoints de autenticación y registro.
 * Estos endpoints son públicos y no requieren autenticación.
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    /**
     * Endpoint para autenticar usuarios (login).
     *
     * @param request DTO con email y contraseña del usuario
     * @return Token JWT y datos básicos del usuario si la autenticación es exitosa
     */
    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> login(@RequestBody AuthRequestDTO request) {
        // El servicio de autenticación valida las credenciales y genera un token
        return ResponseEntity.ok(authService.authenticate(request));
    }

    /**
     * Endpoint para registrar un nuevo usuario.
     *
     * @param user Datos completos del usuario a registrar
     * @return Usuario registrado con código 201 (CREATED)
     */
    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody User user) {
        // El servicio de autenticación registra el usuario y encripta la contraseña
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.register(user));
    }
}
