package com.example.vecinity.dtos;

public class EventImageDto {

    private Long id;
    private String imagenBase64;
    private String descripcion;
    private Long eventId;

    public EventImageDto() {}

    public EventImageDto(Long id, String imagenBase64, String descripcion, Long eventId) {
        this.id = id;
        this.imagenBase64 = imagenBase64;
        this.descripcion = descripcion;
        this.eventId = eventId;
    }

    // Getters y setters

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getImagenBase64() { return imagenBase64; }
    public void setImagenBase64(String imagenBase64) { this.imagenBase64 = imagenBase64; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public Long getEventId() { return eventId; }
    public void setEventId(Long eventId) { this.eventId = eventId; }
}
