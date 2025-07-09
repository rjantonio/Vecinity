package com.example.vecinity.dtos;

import java.time.LocalDateTime;
import java.util.Objects;

public class UserEventDto {
    private Long id;
    private Long userId;
    private Long eventId;
    private LocalDateTime fechaInscripcion;

    // Constructor
    public UserEventDto(Long id, Long userId, Long eventId, LocalDateTime fechaInscripcion) {
        this.id = id;
        this.userId = userId;
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

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
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

    // equals y hashCode (opcional pero útil)
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof UserEventDto that)) return false;
        return Objects.equals(id, that.id) &&
                Objects.equals(userId, that.userId) &&
                Objects.equals(eventId, that.eventId) &&
                Objects.equals(fechaInscripcion, that.fechaInscripcion);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, userId, eventId, fechaInscripcion);
    }

    // toString
    @Override
    public String toString() {
        return "UserEventDto{" +
                "id=" + id +
                ", userId=" + userId +
                ", eventId=" + eventId +
                ", fechaInscripcion=" + fechaInscripcion +
                '}';
    }
}
