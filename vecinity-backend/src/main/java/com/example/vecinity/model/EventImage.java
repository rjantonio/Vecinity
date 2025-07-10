package com.example.vecinity.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

@Entity
@Table(name = "event_images")
public class EventImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "imagen_base64", columnDefinition = "LONGTEXT", nullable = false)
    private String imagenBase64;

    @Column(name = "descripcion", length = 255)
    private String descripcion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id", nullable = false)
    @JsonBackReference  // Para evitar recursión serializando Event -> EventImage -> Event ...
    private Event event;

    public EventImage() {}

    public EventImage(String imagenBase64, String descripcion, Event event) {
        this.imagenBase64 = imagenBase64;
        this.descripcion = descripcion;
        this.event = event;
    }

    // Getters y setters

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getImagenBase64() { return imagenBase64; }
    public void setImagenBase64(String imagenBase64) { this.imagenBase64 = imagenBase64; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public Event getEvent() { return event; }
    public void setEvent(Event event) { this.event = event; }
}
