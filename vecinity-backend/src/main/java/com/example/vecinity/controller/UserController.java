package com.example.vecinity.controller;

import com.example.vecinity.model.User;
import com.example.vecinity.service.UserService;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseToken;
import com.google.firebase.auth.FirebaseAuthException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;


@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping
    public List<User> list () {
        return userService.listAll();
    }

    @PostMapping(consumes = "application/json", produces = "application/json")
    public ResponseEntity<User> crear(HttpServletRequest request, @RequestBody User userFromClient) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpServletResponse.SC_UNAUTHORIZED).build();
        }

        String idToken = authHeader.substring(7);
        try {
            FirebaseToken decodedToken = FirebaseAuth.getInstance().verifyIdToken(idToken);
            String uid = decodedToken.getUid();
            String email = decodedToken.getEmail();
            String name = decodedToken.getName(); // puede ser null

            // Buscar por UID
            Optional<User> existingUser = userService.findByFirebaseUid(uid);
            if (existingUser.isPresent()) {
                return ResponseEntity.ok(existingUser.get());
            }

            // Crear nuevo usuario con datos de Firebase
            User newUser = new User();
            newUser.setFirebaseUid(uid);
            newUser.setEmail(email);
            newUser.setNombre(name != null ? name : userFromClient.getNombre());

            // Contraseña no se usa con Firebase, pero es requerida: asignamos un valor dummy
            newUser.setContrasena("FIREBASE_AUTH");

            // Fecha de registro se inicializa en el constructor por defecto

            return ResponseEntity.ok(userService.save(newUser));
        } catch (FirebaseAuthException e) {
            return ResponseEntity.status(HttpServletResponse.SC_UNAUTHORIZED).build();
        }
    }

    @GetMapping("{id}")
    public ResponseEntity<User> buscar(@PathVariable Long id) {
        return userService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> actualizar(@PathVariable Long id, @RequestBody User user) {
        return userService.findById(id)
                .map(e -> {
                    user.setId(id);
                    return ResponseEntity.ok(userService.save(user));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        if (userService.findById(id).isPresent()) {
            userService.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}