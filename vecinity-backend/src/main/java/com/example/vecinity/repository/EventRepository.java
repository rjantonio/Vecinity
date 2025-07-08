package com.example.vecinity.repository;

import com.example.vecinity.model.Event;
import com.example.vecinity.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    List<Event> findByTituloContainingIgnoreCase(String titulo);

    List<Event> findByCreador(User creador);

    List<Event> findByCreadorId(Long creadorId);

    List<Event> findByFechaEventoAfter(LocalDateTime fecha);

    List<Event> findByFechaEventoBetween(LocalDateTime inicio, LocalDateTime fin);

    List<Event> findByUbicacionContainingIgnoreCase(String ubicacion);
}
