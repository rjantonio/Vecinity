package com.example.vecinity.controller;

import com.example.vecinity.dtos.EventImageDto;
import com.example.vecinity.model.EventImage;
import com.example.vecinity.service.EventImageService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/event-images")
public class EventImageController {

    private final EventImageService eventImageService;

    public EventImageController(EventImageService eventImageService) {
        this.eventImageService = eventImageService;
    }

    @GetMapping("/{eventId}")
    public List<EventImageDto> getImagesByEvent(@PathVariable Long eventId) {
        List<EventImage> images = eventImageService.getImagesByEventId(eventId);
        return images.stream()
                .map(img -> new EventImageDto(
                        img.getId(),
                        img.getImagenBase64(),
                        img.getDescripcion(),
                        img.getEvent().getId()
                ))
                .collect(Collectors.toList());
    }

    @PostMapping("/{eventId}")
    public ResponseEntity<EventImageDto> addImageToEvent(@PathVariable Long eventId,
                                                         @RequestParam String imagenBase64,
                                                         @RequestParam(required = false) String descripcion) {
        EventImage saved = eventImageService.addImageToEvent(eventId, imagenBase64, descripcion);
        EventImageDto dto = new EventImageDto(saved.getId(), saved.getImagenBase64(), saved.getDescripcion(), saved.getEvent().getId());
        return ResponseEntity.status(201).body(dto);
    }

    @PutMapping("/{eventId}")
    public ResponseEntity<Void> updateImagesById(@PathVariable Long eventId, @RequestBody List<EventImageDto> nuevasImagenes) {
        eventImageService.actualizarImagenesEvento(eventId, nuevasImagenes);
        return ResponseEntity.noContent().build();
    }
}
