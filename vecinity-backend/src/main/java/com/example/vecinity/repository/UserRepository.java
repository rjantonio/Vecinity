package com.example.vecinity.repository;

import com.example.vecinity.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    Optional<User> findByFirebaseUid(String firebaseUid);

    List<User> findByNombreContainingIgnoreCase(String nombre);

    boolean existsByEmail(String email);
}
