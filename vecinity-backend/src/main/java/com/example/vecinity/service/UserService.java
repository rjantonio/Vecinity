package com.example.vecinity.service;

import com.example.vecinity.config.ResourceNotFoundException;
import com.example.vecinity.model.User;
import com.example.vecinity.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;

@Service
public class UserService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public List<User> listAll() {
        return userRepository.findAll();
    }

    public User save(User user) {
        // Verificar si el usuario es nuevo
        if (user.getId() == null) {
            // Encriptar la contraseña solo para usuarios nuevos
            user.setContrasena(passwordEncoder.encode(user.getContrasena()));
            user.setFechaRegistro(LocalDateTime.now());

            // Asignar rol de usuario por defecto si no tiene roles
            if (user.getRoles() == null || user.getRoles().isEmpty()) {
                user.setRoles(new HashSet<>());
                user.getRoles().add("USER");
            }
        }
        return userRepository.save(user);
    }

    public User findById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario", "id", id));
    }

    public User update(Long id, User userDetails) {
        User user = findById(id);

        user.setNombre(userDetails.getNombre());
        user.setEmail(userDetails.getEmail());

        // No actualizar contraseña si viene vacía
        if (userDetails.getContrasena() != null && !userDetails.getContrasena().isEmpty()) {
            user.setContrasena(passwordEncoder.encode(userDetails.getContrasena()));
        }

        // Conservar roles existentes si no se especifican
        if (userDetails.getRoles() != null && !userDetails.getRoles().isEmpty()) {
            user.setRoles(userDetails.getRoles());
        }

        return userRepository.save(user);
    }

    public void delete(Long id) {
        User user = findById(id);
        userRepository.delete(user);
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado con email: " + email));
    }
}
