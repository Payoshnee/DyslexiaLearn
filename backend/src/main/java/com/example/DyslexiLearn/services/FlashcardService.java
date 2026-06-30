package com.example.DyslexiLearn.services;

import com.example.DyslexiLearn.models.Flashcard;
import com.example.DyslexiLearn.repositories.FlashcardRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class FlashcardService {

    @Autowired
    private FlashcardRepository flashcardRepository;

    // Create a new flashcard
    public Flashcard createFlashcard(Flashcard flashcard) {
        if (flashcard.getTerm() == null || flashcard.getTerm().isEmpty()) {
            throw new IllegalArgumentException("Term is required");
        }
        return flashcardRepository.save(flashcard);
    }

    // Get all flashcards
    public List<Flashcard> getAllFlashcards() {
        return flashcardRepository.findAll();
    }

    // Update a flashcard by ID
    public Flashcard updateFlashcard(Long id, Flashcard updatedFlashcard) {
        Optional<Flashcard> optionalFlashcard = flashcardRepository.findById(id);
        if (optionalFlashcard.isPresent()) {
            Flashcard flashcard = optionalFlashcard.get();
            flashcard.setTerm(updatedFlashcard.getTerm());
            flashcard.setDefinition(updatedFlashcard.getDefinition());
            flashcard.setScore(updatedFlashcard.getScore());
            return flashcardRepository.save(flashcard);
        } else {
            throw new RuntimeException("Flashcard not found");
        }
    }

    // Delete a flashcard by ID
    public void deleteFlashcard(Long id) {
        if (flashcardRepository.existsById(id)) {
            flashcardRepository.deleteById(id);
        } else {
            throw new RuntimeException("Flashcard not found");
        }
    }
    // valdiating if the score are null ///////
    
    public Flashcard saveFlashcard(Flashcard flashcard) {
        if (flashcard.getScore() == null) {
            flashcard.setScore(0);
        }        
        return flashcardRepository.save(flashcard);
    }
    
}
