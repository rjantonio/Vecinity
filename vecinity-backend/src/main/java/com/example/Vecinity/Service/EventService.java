package com.example.Vecinity.Service;

import com.example.Vecinity.Model.Event;
import com.example.Vecinity.Repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EventService {

    @Autowired
    private EventRepository EventRepository;

    public List<Event> listAll() {
        return EventRepository.findAll();
    }

    public Event save(Event event) {
        return EventRepository.save(event);
    }

    public Optional<Event> findById(Long id) {
        return EventRepository.findById(id);
    }

    public void deleteById(Long id) {
        EventRepository.deleteById(id);
    }

}
