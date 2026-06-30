package com.example.DyslexiLearn.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.SQLException;

@RestController
@RequestMapping("/api/test")
public class TestController {

    @Autowired
    private DataSource dataSource;

    // Endpoint to test the database connection
    @GetMapping("/db")
    public ResponseEntity<String> testDbConnection() {
        try (Connection connection = dataSource.getConnection()) {
            // Check if the connection is not null
            if (connection != null) {
                return ResponseEntity.ok("Database connection successful!");
            }
        } catch (SQLException e) {
            // If an exception occurs, return the error message
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Database connection failed: " + e.getMessage());
        }
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Unknown error!");
    }
}
