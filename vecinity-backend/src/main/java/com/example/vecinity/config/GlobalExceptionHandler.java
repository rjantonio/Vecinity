package com.example.vecinity.config;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

/**
 * Manejador global de excepciones para toda la aplicación.
 * Centraliza la gestión de errores para proporcionar respuestas coherentes.
 * La anotación @ControllerAdvice permite que Spring aplique este manejador
 * a todos los controladores de la aplicación.
 */
@ControllerAdvice
public class GlobalExceptionHandler {

    /**
     * Maneja las excepciones ResourceNotFoundException lanzadas cuando un recurso
     * solicitado no existe en la base de datos.
     *
     * @param ex La excepción capturada
     * @param request La solicitud web que generó la excepción
     * @return ResponseEntity con detalles del error y código HTTP 404 (Not Found)
     */
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorDetails> handleResourceNotFoundException(
            ResourceNotFoundException ex, WebRequest request) {
        ErrorDetails errorDetails = new ErrorDetails(
                new Date(),
                ex.getMessage(),
                request.getDescription(false));
        return new ResponseEntity<>(errorDetails, HttpStatus.NOT_FOUND);
    }

    /**
     * Maneja errores de validación de formularios o cuerpos de petición.
     * Se activa cuando los datos enviados no cumplen con las validaciones
     * definidas mediante anotaciones como @Valid, @NotNull, etc.
     *
     * @param ex La excepción de validación capturada
     * @return ResponseEntity con mapa de errores de campos y código HTTP 400 (Bad Request)
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationExceptions(
            MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(error -> {
            errors.put(error.getField(), error.getDefaultMessage());
        });
        return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
    }

    /**
     * Manejador genérico para cualquier otra excepción no controlada específicamente.
     * Funciona como red de seguridad para capturar errores inesperados.
     *
     * @param ex La excepción general capturada
     * @param request La solicitud web que generó la excepción
     * @return ResponseEntity con detalles del error y código HTTP 500 (Internal Server Error)
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorDetails> handleGlobalException(
            Exception ex, WebRequest request) {
        ErrorDetails errorDetails = new ErrorDetails(
                new Date(),
                ex.getMessage(),
                request.getDescription(false));
        return new ResponseEntity<>(errorDetails, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    /**
     * Clase interna para estructurar los detalles de error de forma consistente.
     * Define el formato JSON de respuesta para las excepciones capturadas.
     */
    public static class ErrorDetails {
        private Date timestamp;  // Momento en que ocurrió el error
        private String message;  // Mensaje descriptivo del error
        private String details;  // Detalles adicionales (generalmente la URL de la petición)

        /**
         * Constructor para crear un objeto de detalles de error.
         *
         * @param timestamp Momento en que ocurrió el error
         * @param message Mensaje descriptivo del error
         * @param details Detalles adicionales sobre el error
         */
        public ErrorDetails(Date timestamp, String message, String details) {
            this.timestamp = timestamp;
            this.message = message;
            this.details = details;
        }

        // Getters (necesarios para la serialización JSON)
        public Date getTimestamp() {
            return timestamp;
        }

        public String getMessage() {
            return message;
        }

        public String getDetails() {
            return details;
        }
    }
}
