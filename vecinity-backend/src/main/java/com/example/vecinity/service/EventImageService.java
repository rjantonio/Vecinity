package com.example.vecinity.service;

import com.example.vecinity.dtos.EventImageDto;
import com.example.vecinity.model.Event;
import com.example.vecinity.model.EventImage;
import com.example.vecinity.repository.EventImageRepository;
import com.example.vecinity.repository.EventRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
public class EventImageService {

    private final EventImageRepository eventImageRepository;
    private final EventRepository eventRepository;

    public EventImageService(EventImageRepository eventImageRepository, EventRepository eventRepository) {
        this.eventImageRepository = eventImageRepository;
        this.eventRepository = eventRepository;
    }

    public List<EventImage> getImagesByEventId(Long eventId) {
        return eventImageRepository.findByEventId(eventId);
    }

    public EventImage addImageToEvent(Long eventId, String imagenBase64, String descripcion) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new IllegalArgumentException("Evento no encontrado con id: " + eventId));

        EventImage eventImage = new EventImage(imagenBase64, descripcion, event);
        return eventImageRepository.save(eventImage);
    }

    @Transactional
    public void actualizarImagenesEvento(Long eventId, List<EventImageDto> nuevasImagenes) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Evento no encontrado"));

        // Eliminar todas las imágenes existentes del evento
        List<EventImage> imagenesExistentes = eventImageRepository.findByEventId(eventId);
        eventImageRepository.deleteAll(imagenesExistentes);

        // Crear y guardar las nuevas imágenes
        for (EventImageDto dto : nuevasImagenes) {
            EventImage nuevaImagen = new EventImage(dto.getImagenBase64(), dto.getDescripcion(), event);
            eventImageRepository.save(nuevaImagen);
        }
    }

}
