package com.example.vecinity.dtos;

import java.time.LocalDateTime;

public class EventRegistrationDto {
    private Long id;
    private Long eventId;
    private LocalDateTime fechaInscripcion;

    public EventRegistrationDto(Long id, Long eventId, LocalDateTime fechaInscripcion) {
        this.id = id;
        this.eventId = eventId;
        this.fechaInscripcion = fechaInscripcion;
    }

    // Getters y setters
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }

    public Long getEventId() {
        return eventId;
    }
    public void setEventId(Long eventId) {
        this.eventId = eventId;
    }

    public LocalDateTime getFechaInscripcion() {
        return fechaInscripcion;
    }
    public void setFechaInscripcion(LocalDateTime fechaInscripcion) {
        this.fechaInscripcion = fechaInscripcion;
    }
}
