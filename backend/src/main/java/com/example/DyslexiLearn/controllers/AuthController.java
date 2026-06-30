package com.example.DyslexiLearn.controllers;

import com.example.DyslexiLearn.models.User;
import com.example.DyslexiLearn.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;

    @Autowired
    public AuthController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        String password = payload.get("password");

        if (email == null || password == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email and password are required"));
        }

        Optional<User> userOpt = userRepository.findFirstByEmailOrderByIdAsc(email);

        if (userOpt.isPresent()) {
            User user = userOpt.get();
            // In a real app, use BCryptPasswordEncoder. For this demo, simple string matching.
            if (user.getPassword().equals(password)) {
                return ResponseEntity.ok(Map.of(
                        "message", "Login successful",
                        "name", user.getName(),
                        "email", user.getEmail()
                ));
            }
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Invalid email or password"));
    }
}
