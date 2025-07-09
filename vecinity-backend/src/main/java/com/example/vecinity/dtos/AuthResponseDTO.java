package com.example.vecinity.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * DTO para la respuesta de autenticación
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponseDTO {
    private String token;
    private String type = "Bearer"; // Tipo de token siempre será Bearer
    private Long id;
    private String nombre;
    private String email;
    private List<String> roles;
}
