package com.example.Vecinity.Controller;

import com.example.Vecinity.Model.User;
import com.example.Vecinity.Repository.UserRepository;
import com.example.Vecinity.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping
    public List<User> list () {
        return userService.listAll();
    }

    @PostMapping
    public User crear(@RequestBody User user) {
        return userService.save(user);
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