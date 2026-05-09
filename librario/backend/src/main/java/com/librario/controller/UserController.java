package com.librario.controller;

import com.librario.model.User;
import com.librario.repository.UserRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // ADMIN only - enforced in SecurityConfig
    @GetMapping
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
}
