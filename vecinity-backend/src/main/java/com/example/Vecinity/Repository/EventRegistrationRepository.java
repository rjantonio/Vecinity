package com.example.Vecinity.Repository;

import com.example.Vecinity.Model.Event;
import com.example.Vecinity.Model.EventRegistration;
import com.example.Vecinity.Model.User;
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
}
