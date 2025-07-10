package com.example.vecinity.service;

import com.example.vecinity.model.User;
import com.example.vecinity.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public List<User> listAll() {
        return userRepository.findAll();
    }

    public User save(User user) {
        return userRepository.save(user);
    }

    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }

    public void deleteById(Long id) {
        userRepository.deleteById(id);
    }

    // Nuevo método para buscar usuario por firebaseUid
    public Optional<User> findByFirebaseUid(String firebaseUid) {
        return userRepository.findByFirebaseUid(firebaseUid);
    }

    // Nuevo método para crear usuario si no existe
    public User createUserIfNotExists(String firebaseUid, String email, String nombre) {
        return findByFirebaseUid(firebaseUid).orElseGet(() -> {
            User user = new User();
            user.setFirebaseUid(firebaseUid);
            user.setEmail(email);
            user.setNombre(nombre);
            // Puedes inicializar otros campos si quieres, por ejemplo fechaRegistro se pone en el constructor
            return save(user);
        });
    }
}
