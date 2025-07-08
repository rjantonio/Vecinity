package com.example.vecinity.dtos;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class UserEventDto {
    private Long id;
    private Long userId;
    private Long eventId;
    private LocalDateTime fechaInscripcion;

    public UserEventDto(Long id, Long userId, Long eventId, LocalDateTime fechaInscripcion) {
        this.id = id;
        this.userId = userId;
        this.eventId = eventId;
        this.fechaInscripcion = fechaInscripcion;
    }
}
