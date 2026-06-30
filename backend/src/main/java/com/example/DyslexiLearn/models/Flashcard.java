package com.example.DyslexiLearn.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;

@Entity
public class Flashcard {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    @Size(min = 1, max = 100, message = "Term must be between 1 and 100 characters")
    private String term;

    @Column(nullable = false)
    @Size(min = 1, max = 255, message = "Definition must be between 1 and 255 characters")
    private String definition;

    @Column(nullable = false)
    @Min(value = 0, message = "Score cannot be negative")
    private Integer score = 0; // Use Integer for null-safe handling

    // Default constructor
    public Flashcard() {
        this.score = 0; // Initialize score to 0
    }

    // Parameterized constructor
    public Flashcard(String term, String definition) {
        this.term = term;
        this.definition = definition;
        this.score = 0; // Ensure score defaults to 0
    }

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTerm() {
        return term;
    }

    public void setTerm(String term) {
        this.term = term;
    }

    public String getDefinition() {
        return definition;
    }

    public void setDefinition(String definition) {
        this.definition = definition;
    }

    public Integer getScore() {
        return score;
    }

    public void setScore(Integer score) {
        this.score = (score == null) ? 0 : score;
    }

    @Override
    public String toString() {
        return "Flashcard{" +
                "id=" + id +
                ", term='" + term + '\'' +
                ", definition='" + definition + '\'' +
                ", score=" + score +
                '}';
    }
}
