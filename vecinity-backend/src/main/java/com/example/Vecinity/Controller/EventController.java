package com.example.Vecinity.Controller;

import com.example.Vecinity.Model.Event;
import com.example.Vecinity.Repository.EventRepository;
import com.example.Vecinity.Service.EventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/event")
public class EventController {

    @Autowired
    private EventService eventService;

    @GetMapping
    public List<Event> list () {
        return eventService.listAll();
    }

    @PostMapping
    public Event crear(@RequestBody Event event) {
        return eventService.save(event);
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