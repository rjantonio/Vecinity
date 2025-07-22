package com.example.vecinity.service;

import com.example.vecinity.model.Event;
import com.example.vecinity.model.EventRegistration;
import com.example.vecinity.model.User;
import com.example.vecinity.repository.EventRegistrationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import com.example.vecinity.dtos.EventRegistrationDto;
import java.util.stream.Collectors;

@Service
public class EventRegistrationService {

    @Autowired
    private EventRegistrationRepository eventRegistrationRepository;

    /**
     * Obtiene todas las inscripciones a eventos
     */
    public List<EventRegistration> listAll() {
        return eventRegistrationRepository.findAll();
    }

    /**
     * Guarda una inscripción a evento
     */
    public EventRegistration save(EventRegistration eventRegistration) {
        return eventRegistrationRepository.save(eventRegistration);
    }

    /**
     * Busca una inscripción por su ID
     */
    public Optional<EventRegistration> findById(Long id) {
        return eventRegistrationRepository.findById(id);
    }

    /**
     * Elimina una inscripción por su ID
     */
    public void deleteById(Long id) {
        eventRegistrationRepository.deleteById(id);
    }

    /**
     * Busca inscripciones por usuario
     */
    public List<EventRegistration> findByUsuario(User usuario) {
        return eventRegistrationRepository.findByUsuario(usuario);
    }

    /**
     * Busca inscripciones por ID de usuario
     */
    public List<EventRegistration> findByUsuarioId(Long usuarioId) {
        return eventRegistrationRepository.findByUsuarioId(usuarioId);
    }

    /**
     * Busca inscripciones por evento
     */
    public List<EventRegistration> findByEvento(Event evento) {
        return eventRegistrationRepository.findByEvento(evento);
    }

    /**
     * Busca inscripciones por ID de evento
     */
    public List<EventRegistration> findByEventoId(Long eventoId) {
        return eventRegistrationRepository.findByEventoId(eventoId);
    }

    /**
     * Busca una inscripción específica por usuario y evento
     */
    public Optional<EventRegistration> findByUsuarioAndEvento(User usuario, Event evento) {
        return eventRegistrationRepository.findByUsuarioAndEvento(usuario, evento);
    }

    /**
     * Verifica si existe una inscripción para un usuario y evento específicos
     */
    public boolean existsByUsuarioAndEvento(User usuario, Event evento) {
        return eventRegistrationRepository.existsByUsuarioAndEvento(usuario, evento);
    }

    /**
     * Elimina una inscripción por usuario y evento
     */
    public void deleteByUsuarioAndEvento(User usuario, Event evento) {
        eventRegistrationRepository.deleteByUsuarioAndEvento(usuario, evento);
    }

    /**
     * Busca inscripciones realizadas después de una fecha determinada
     */
    public List<EventRegistration> findByFechaInscripcionAfter(LocalDateTime fecha) {
        return eventRegistrationRepository.findByFechaInscripcionAfter(fecha);
    }

    public List<EventRegistrationDto> mapToDtoList(List<EventRegistration> registrations) {
        return registrations.stream()
                .map(reg -> new EventRegistrationDto(
                        reg.getId(),
                        reg.getEvento().getId(),
                        reg.getFechaInscripcion()
                ))
                .collect(Collectors.toList());
    }

    public long countByEvento(Event event) {
        return eventRegistrationRepository.countByEvento(event);
    }

}
