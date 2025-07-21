package com.example.vecinity.dtos;

import java.time.LocalDateTime;
import java.util.List;

public class EventDetailDto {
    private Long id;
    private String titulo;
    private String descripcion;
    private LocalDateTime fechaEvento;
    private LocalDateTime fechaCreacion;
    private String ubicacion;
    private String creadorId;
    private String creadorNombre;
    private List<EventImageDto> imagenes;  // NUEVO campo para las imágenes

    // Constructor completo con imágenes
    public EventDetailDto(Long id, String titulo, String descripcion,
                          LocalDateTime fechaEvento, String ubicacion,
                          String creadorId, String creadorNombre, LocalDateTime fechaCreacion,
                          List<EventImageDto> imagenes) {
        this.id = id;
        this.titulo = titulo;
        this.descripcion = descripcion;
        this.fechaEvento = fechaEvento;
        this.ubicacion = ubicacion;
        this.creadorId = creadorId;
        this.creadorNombre = creadorNombre;
        this.fechaCreacion = fechaCreacion;
        this.imagenes = imagenes;
    }

    // Constructor vacío (necesario para serialización, si usas frameworks como Jackson)
    public EventDetailDto() {}

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

    public String getCreadorNombre() {
        return creadorNombre;
    }

    public LocalDateTime getFechaCreacion() {
        return fechaCreacion;
    }

    public List<EventImageDto> getImagenes() {
        return imagenes;
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

    public void setCreadorNombre(String creadorNombre) {
        this.creadorNombre = creadorNombre;
    }

    public void setFechaCreacion(LocalDateTime fechaCreacion) {
        this.fechaCreacion = fechaCreacion;
    }

    public void setImagenes(List<EventImageDto> imagenes) {
        this.imagenes = imagenes;
    }
}
