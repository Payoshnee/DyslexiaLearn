package com.example.DyslexiLearn.controllers;

import com.example.DyslexiLearn.services.AIService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
public class AIController {

    private final AIService aiService;

    @Autowired
    public AIController(AIService aiService) {
        this.aiService = aiService;
    }

    @PostMapping("/rag/ask")
    public ResponseEntity<Map<String, String>> askRAG(@RequestBody Map<String, String> payload) {
        String question = payload.get("question");
        String answer = aiService.askRAG(question);
        return ResponseEntity.ok(Map.of("answer", answer));
    }

    @PostMapping("/synonym")
    public ResponseEntity<Map<String, String>> getSynonym(@RequestBody Map<String, String> payload) {
        String word = payload.get("word");
        String sentence = payload.get("sentence");
        String result = aiService.getSynonym(word, sentence);
        return ResponseEntity.ok(Map.of("response", result));
    }

    @PostMapping("/socratic")
    public ResponseEntity<Map<String, String>> socraticTutor(@RequestBody Map<String, String> payload) {
        String question = payload.get("question");
        String context = payload.get("context");
        String result = aiService.socraticTutor(question, context);
        return ResponseEntity.ok(Map.of("response", result));
    }
}
