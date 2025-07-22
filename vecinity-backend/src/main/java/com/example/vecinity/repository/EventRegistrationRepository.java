package com.example.vecinity.repository;

import com.example.vecinity.model.Event;
import com.example.vecinity.model.EventRegistration;
import com.example.vecinity.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface EventRegistrationRepository extends JpaRepository<EventRegistration, Long> {
    List<EventRegistration> findByUsuario(User usuario);

    List<EventRegistration> findByUsuarioId(Long usuarioId);

    List<EventRegistration> findByEvento(Event evento);

    List<EventRegistration> findByEventoId(Long eventoId);

    Optional<EventRegistration> findByUsuarioAndEvento(User usuario, Event evento);

    List<EventRegistration> findByFechaInscripcionAfter(LocalDateTime fecha);

    boolean existsByUsuarioAndEvento(User usuario, Event evento);

    void deleteByUsuarioAndEvento(User usuario, Event evento);

    long countByEvento(Event event);
}
