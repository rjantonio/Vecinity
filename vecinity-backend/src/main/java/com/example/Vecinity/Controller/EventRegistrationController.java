package com.example.Vecinity.Controller;

import com.example.Vecinity.Model.Event;
import com.example.Vecinity.Model.EventRegistration;
import com.example.Vecinity.Model.User;
import com.example.Vecinity.Service.EventRegistrationService;
import com.example.Vecinity.Service.EventService;
import com.example.Vecinity.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/event-registration")
public class EventRegistrationController {

    @Autowired
    private EventRegistrationService eventRegistrationService;

    @Autowired
    private UserService userService;

    @Autowired
    private EventService eventService;

    @GetMapping
    public List<EventRegistration> listar() {
        return eventRegistrationService.listAll();
    }

    @GetMapping("/user/{userId}")
    public List<EventRegistration> listarPorUsuario(@PathVariable Long userId) {
        Optional<User> user = userService.findById(userId);
        return user.map(u -> eventRegistrationService.findByUsuario(u))
                .orElse(Collections.emptyList());
    }

    @GetMapping("/event/{eventId}")
    public List<EventRegistration> listarPorEvento(@PathVariable Long eventId) {
        Optional<Event> event = eventService.findById(eventId);
        return event.map(e -> eventRegistrationService.findByEvento(e))
                .orElse(Collections.emptyList());
    }

    @PostMapping("/register")
    public ResponseEntity<?> registrarAEvento(@RequestParam Long userId, @RequestParam Long eventId) {
        Optional<User> user = userService.findById(userId);
        Optional<Event> event = eventService.findById(eventId);

        if (user.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuario no encontrado");
        }

        if (event.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Evento no encontrado");
        }

        // Verificar si ya existe la inscripción
        if (eventRegistrationService.existsByUsuarioAndEvento(user.get(), event.get())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("El usuario ya está inscrito a este evento");
        }

        // Crear y guardar la inscripción
        EventRegistration registration = new EventRegistration(user.get(), event.get());
        registration.setFechaInscripcion(LocalDateTime.now());
        EventRegistration savedRegistration = eventRegistrationService.save(registration);

        return ResponseEntity.status(HttpStatus.CREATED).body(savedRegistration);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> cancelarInscripcion(@PathVariable Long id) {
        if (eventRegistrationService.findById(id).isPresent()) {
            eventRegistrationService.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/user/{userId}/event/{eventId}")
    public ResponseEntity<Void> cancelarInscripcionPorUsuarioYEvento(
            @PathVariable Long userId,
            @PathVariable Long eventId) {

        Optional<User> user = userService.findById(userId);
        Optional<Event> event = eventService.findById(eventId);

        if (user.isEmpty() || event.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Optional<EventRegistration> registration =
                eventRegistrationService.findByUsuarioAndEvento(user.get(), event.get());

        if (registration.isPresent()) {
            eventRegistrationService.deleteByUsuarioAndEvento(user.get(), event.get());
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
