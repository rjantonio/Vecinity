package com.example.vecinity.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.Objects;

@Entity
@Table(name = "event_registrations", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"id_usuario", "id_evento"})
})
public class EventRegistration {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "id_usuario", nullable = false)
    @JsonBackReference("user-registration")
    private User usuario;

    @ManyToOne
    @JoinColumn(name = "id_evento", nullable = false)
    @JsonBackReference("event-registration")
    private Event evento;

    @Column(name = "fecha_inscripcion", updatable = false)
    private LocalDateTime fechaInscripcion;

    // Constructor vacío (requerido por JPA)
    public EventRegistration() {
    }

    // Constructor con parámetros
    public EventRegistration(User usuario, Event evento) {
        this.usuario = usuario;
        this.evento = evento;
        this.fechaInscripcion = LocalDateTime.now();
    }

    // Getters y setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUsuario() {
        return usuario;
    }

    public void setUsuario(User usuario) {
        this.usuario = usuario;
    }

    public Event getEvento() {
        return evento;
    }

    public void setEvento(Event evento) {
        this.evento = evento;
    }

    public LocalDateTime getFechaInscripcion() {
        return fechaInscripcion;
    }

    public void setFechaInscripcion(LocalDateTime fechaInscripcion) {
        this.fechaInscripcion = fechaInscripcion;
    }

    // equals y hashCode (por ID)
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof EventRegistration that)) return false;
        return Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    // toString sin relaciones
    @Override
    public String toString() {
        return "EventRegistration{" +
                "id=" + id +
                ", fechaInscripcion=" + fechaInscripcion +
                '}';
    }
}
