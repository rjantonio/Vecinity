package com.example.vecinity.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para la solicitud de autenticación
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthRequestDTO {
    private String email;
    private String password;
}
