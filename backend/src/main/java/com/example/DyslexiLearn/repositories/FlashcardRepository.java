package com.example.DyslexiLearn.repositories;

import com.example.DyslexiLearn.models.Flashcard;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FlashcardRepository extends JpaRepository<Flashcard, Long> {
    // Custom queries can be defined here if needed.
}
