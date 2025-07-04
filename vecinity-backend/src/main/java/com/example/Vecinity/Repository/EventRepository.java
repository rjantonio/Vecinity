package com.example.Vecinity.Repository;

import com.example.Vecinity.Model.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    public List<Event> findEventByNombreContaining(String nombre);
    public List<Event> findEventByInstructor_Id (Long instructorId);
}
