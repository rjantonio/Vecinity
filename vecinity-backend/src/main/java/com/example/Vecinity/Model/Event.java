package com.example.Vecinity.Model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.ToString;
import lombok.EqualsAndHashCode;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "events")
@Data
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Eliminadas todas las anotaciones de validación para evitar problemas
    @Column(name = "titulo", nullable = false, length = 150)
    private String titulo;

    @Column(name = "descripcion", columnDefinition = "TEXT")
    private String descripcion;

    @Column(name = "fecha_evento", nullable = false)
    private LocalDateTime fechaEvento;

    @Column(name = "fecha_creacion", updatable = false)
    private LocalDateTime fechaCreacion;

    @Column(name = "ubicacion", length = 200)
    private String ubicacion;

    @ManyToOne
    @JoinColumn(name = "id_creador", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private User creador;

    @OneToMany(mappedBy = "evento", cascade = CascadeType.ALL)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Set<EventRegistration> inscripciones = new HashSet<>();

    // Constructor por defecto necesario para JPA y para inicializar fechaCreacion
    public Event() {
        this.fechaCreacion = LocalDateTime.now();
    }

    // Constructor con parámetros
    public Event(String titulo, String descripcion, LocalDateTime fechaEvento, String ubicacion, User creador) {
        this.titulo = titulo;
        this.descripcion = descripcion;
        this.fechaEvento = fechaEvento;
        this.ubicacion = ubicacion;
        this.creador = creador;
        this.fechaCreacion = LocalDateTime.now();
    }
}
