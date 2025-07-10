package com.example.vecinity.service;

import com.example.vecinity.model.Event;
import com.example.vecinity.model.EventImage;
import com.example.vecinity.repository.EventImageRepository;
import com.example.vecinity.repository.EventRepository;
import org.springframework.stereotype.Service;

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

    public void deleteImagesByEventId(Long eventId) {
        eventImageRepository.deleteByEventId(eventId);
    }
}
