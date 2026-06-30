package com.example.DyslexiLearn.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class MainController {

    @GetMapping("/")
    public String home() {
        return "Welcome to DyslexiLearn!";
    }

    @GetMapping("/health")
    public String healthCheck() {
        return "Server is running!";
    }
}
