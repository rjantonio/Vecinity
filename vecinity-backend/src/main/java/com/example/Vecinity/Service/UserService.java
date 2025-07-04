package com.example.Vecinity.Service;

import com.example.Vecinity.Model.User;
import com.example.Vecinity.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository UserRepository;

    public List<User> listAll() {
        return UserRepository.findAll();
    }

    public User save(User user) {
        return UserRepository.save(user);
    }

    public Optional<User> findById(Long id) {
        return UserRepository.findById(id);
    }

    public void deleteById(Long id) {
        UserRepository.deleteById(id);
    }

}
