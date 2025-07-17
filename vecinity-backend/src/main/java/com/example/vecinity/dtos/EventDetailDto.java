package com.example.vecinity.dtos;

import java.time.LocalDateTime;

public class EventDetailDto {
    private Long id;
    private String titulo;
    private String descripcion;
    private LocalDateTime fechaEvento;
    private LocalDateTime fechaCreacion;
    private String ubicacion;
    private String creadorId;

    // Constructor completo
    public EventDetailDto(Long id, String titulo, String descripcion,
                          LocalDateTime fechaEvento, String ubicacion,
                          String creadorId, LocalDateTime fechaCreacion) {
        this.id = id;
        this.titulo = titulo;
        this.descripcion = descripcion;
        this.fechaEvento = fechaEvento;
        this.ubicacion = ubicacion;
        this.creadorId = creadorId;
        this.fechaCreacion = fechaCreacion;
    }

    // Constructor vacío (necesario para serialización, si usas frameworks como Jackson)
    public EventDetailDto() {
    }

    // Getters
    public Long getId() {
        return id;
    }

    public String getTitulo() {
        return titulo;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public LocalDateTime getFechaEvento() {
        return fechaEvento;
    }

    public String getUbicacion() {
        return ubicacion;
    }

    public String getCreadorId() {
        return creadorId;
    }

    public LocalDateTime getFechaCreacion() {
        return fechaCreacion;
    }

    // Setters
    public void setId(Long id) {
        this.id = id;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public void setFechaEvento(LocalDateTime fechaEvento) {
        this.fechaEvento = fechaEvento;
    }

    public void setUbicacion(String ubicacion) {
        this.ubicacion = ubicacion;
    }

    public void setCreadorId(String creadorId) {
        this.creadorId = creadorId;
    }

    public void setFechaCreacion(LocalDateTime fechaCreacion) {
        this.fechaCreacion = fechaCreacion;
    }
}
