package com.example.vecinity.controller;

import com.example.vecinity.model.Event;
import com.example.vecinity.model.User;
import com.example.vecinity.repository.UserRepository;
import com.example.vecinity.service.EventService;
import com.google.firebase.auth.FirebaseToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/event")
public class EventController {

    @Autowired
    private EventService eventService;

    @Autowired
    private UserRepository userRepository; // Inyección del repo

    @GetMapping
    public List<Event> list() {
        return eventService.listAll();
    }

    @PostMapping
    public ResponseEntity<Event> crear(@RequestBody Event event) {
        String uid = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        User user = userRepository.findByFirebaseUid(uid)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        event.setCreador(user);

        Event saved = eventService.save(event);
        return ResponseEntity.ok(saved);
    }


    @GetMapping("{id}")
    public ResponseEntity<Event> buscar(@PathVariable Long id) {
        return eventService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Event> actualizar(@PathVariable Long id, @RequestBody Event event) {
        return eventService.findById(id)
                .map(e -> {
                    event.setId(id);
                    return ResponseEntity.ok(eventService.save(event));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        if (eventService.findById(id).isPresent()) {
            eventService.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
