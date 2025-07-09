package com.example.vecinity.config;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Excepción personalizada para manejar casos donde un recurso solicitado no existe.
 * La anotación @ResponseStatus garantiza que Spring devuelva un código HTTP 404
 * cuando esta excepción sea lanzada.
 */
@ResponseStatus(HttpStatus.NOT_FOUND)
public class ResourceNotFoundException extends RuntimeException {

    private static final long serialVersionUID = 1L;

    /**
     * Constructor con mensaje personalizado.
     *
     * @param message Mensaje descriptivo del error
     */
    public ResourceNotFoundException(String message) {
        super(message);
    }

    /**
     * Constructor que genera un mensaje descriptivo basado en el recurso, campo y valor.
     * Ejemplo: "Usuario no encontrado con id: '123'"
     *
     * @param resourceName Nombre del recurso (ej. "Usuario", "Evento")
     * @param fieldName Campo usado en la búsqueda (ej. "id", "email")
     * @param fieldValue Valor del campo que no fue encontrado
     */
    public ResourceNotFoundException(String resourceName, String fieldName, Object fieldValue) {
        super(String.format("%s no encontrado con %s: '%s'", resourceName, fieldName, fieldValue));
    }
}
