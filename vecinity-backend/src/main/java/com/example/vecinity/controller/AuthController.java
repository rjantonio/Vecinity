package com.example.vecinity.controller;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseToken;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @PostMapping("/verify")
    public ResponseEntity<String> verifyToken(@RequestHeader("Authorization") String authorization) {
        try {
            String idToken = authorization.replace("Bearer ", "");
            FirebaseToken decodedToken = FirebaseAuth.getInstance().verifyIdToken(idToken);
            String uid = decodedToken.getUid();
            // Aquí puedes usar el uid para tus operaciones
            return ResponseEntity.ok("Token válido para el usuario: " + uid);
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Token inválido");
        }
    }
}