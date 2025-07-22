package com.example.vecinity.controller;

import com.example.vecinity.dtos.EventRegistrationDto;
import com.example.vecinity.dtos.UserEventDto;
import com.example.vecinity.model.Event;
import com.example.vecinity.model.EventRegistration;
import com.example.vecinity.model.User;
import com.example.vecinity.service.EventRegistrationService;
import com.example.vecinity.service.EventService;
import com.example.vecinity.service.UserService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

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
    public List<UserEventDto> listar() {
        return eventRegistrationService.listAll().stream()
                .map(reg -> new UserEventDto(
                        reg.getId(),
                        reg.getUsuario().getId(),
                        reg.getEvento().getId(),
                        reg.getFechaInscripcion()))
                .toList();
    }

    @GetMapping("/user/{userId}")
    public List<UserEventDto> listarPorUsuario(@PathVariable String userId) {
        Optional<User> user = userService.findByFirebaseUid(userId);
        if (user.isEmpty()) {
            return Collections.emptyList();
        }
        List<EventRegistration> regs = eventRegistrationService.findByUsuario(user.get());
        // Mapear a DTO
        return regs.stream()
                .map(reg -> new UserEventDto(
                        reg.getId(),
                        reg.getUsuario().getId(),
                        reg.getEvento().getId(),
                        reg.getFechaInscripcion()
                ))
                .collect(Collectors.toList());
    }



    @GetMapping("/event/{eventId}")
    public List<EventRegistration> listarPorEvento(@PathVariable Long eventId) {
        Optional<Event> event = eventService.findById(eventId);
        return event.map(e -> eventRegistrationService.findByEvento(e))
                .orElse(Collections.emptyList());
    }

    @PostMapping("/register")
    public ResponseEntity<?> registrarAEvento(@RequestParam String userId, @RequestParam Long eventId) {
        Optional<User> user = userService.findByFirebaseUid(userId);
        Optional<Event> event = eventService.findById(eventId);

        if (user.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuario no encontrado");
        }

        if (event.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Evento no encontrado");
        }

        if (eventRegistrationService.existsByUsuarioAndEvento(user.get(), event.get())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Ya registrado");
        }

        EventRegistration registration = new EventRegistration(user.get(), event.get());
        EventRegistration saved = eventRegistrationService.save(registration);

        UserEventDto dto = new UserEventDto(
                saved.getId(),
                saved.getUsuario().getId(),
                saved.getEvento().getId(),
                saved.getFechaInscripcion()
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(dto);
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

    @Transactional
    @DeleteMapping("/user/{userId}/event/{eventId}")
    public ResponseEntity<Void> cancelarInscripcionPorUsuarioYEvento(
            @PathVariable String userId,
            @PathVariable Long eventId) {

        Optional<User> user = userService.findByFirebaseUid(userId);
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

    @GetMapping("/is-registered")
    public ResponseEntity<Boolean> isUserRegistered(
            @RequestParam String userId,
            @RequestParam Long eventId) {

        Optional<User> user = userService.findByFirebaseUid(userId);
        Optional<Event> event = eventService.findById(eventId);

        if (user.isEmpty() || event.isEmpty()) {
            return ResponseEntity.ok(false);
        }

        boolean exists = eventRegistrationService.existsByUsuarioAndEvento(user.get(), event.get());
        return ResponseEntity.ok(exists);
    }

    @GetMapping("/count/event/{eventId}")
    public ResponseEntity<Long> countByEvent(@PathVariable Long eventId) {
        Optional<Event> event = eventService.findById(eventId);
        if (event.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        long count = eventRegistrationService.countByEvento(event.get());
        return ResponseEntity.ok(count);
    }

}
