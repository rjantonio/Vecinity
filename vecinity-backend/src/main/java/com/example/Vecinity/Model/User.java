package com.example.Vecinity.Model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.ToString;
import lombok.EqualsAndHashCode;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "users")
@Data
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    //@NotBlank(message = "El nombre es obligatorio")
    //@Size(max = 100, message = "El nombre no puede exceder los 100 caracteres")
    @Column(name = "nombre", nullable = false, length = 100)
    private String nombre;

    //@NotBlank(message = "El email es obligatorio")
    //@Email(message = "El formato del email no es válido")
    //@Size(max = 100, message = "El email no puede exceder los 100 caracteres")
    @Column(name = "email", nullable = false, unique = true, length = 100)
    private String email;

    //@NotBlank(message = "La contraseña es obligatoria")
    //@Size(min = 8, message = "La contraseña debe tener al menos 8 caracteres")
    @Column(name = "contrasena", nullable = false, length = 255)
    private String contrasena;

    @Column(name = "fecha_registro")
    private LocalDateTime fechaRegistro;

    @OneToMany(mappedBy = "creador", cascade = CascadeType.ALL)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Set<Event> eventosCreados = new HashSet<>();

    @OneToMany(mappedBy = "usuario", cascade = CascadeType.ALL)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Set<EventRegistration> inscripciones = new HashSet<>();

    // Constructor por defecto necesario para JPA y para inicializar fechaRegistro
    public User() {
        this.fechaRegistro = LocalDateTime.now();
    }

    // Constructor con parámetros
    public User(String nombre, String email, String contrasena) {
        this.nombre = nombre;
        this.email = email;
        this.contrasena = contrasena;
        this.fechaRegistro = LocalDateTime.now();
    }
}
