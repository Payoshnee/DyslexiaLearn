package com.example.DyslexiLearn.services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
public class AIService {

    private final RestTemplate restTemplate;
    
    // We connect to the local Python FastAPI microservice
    @Value("${ai.service.url:http://localhost:8000}")
    private String aiServiceUrl;

    public AIService() {
        this.restTemplate = new RestTemplate();
    }

    private String postToAI(String endpoint, Map<String, String> payload) {
        String url = aiServiceUrl + endpoint;
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        
        HttpEntity<Map<String, String>> request = new HttpEntity<>(payload, headers);
        
        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(url, request, Map.class);
            if (response.getBody() != null && response.getBody().containsKey("response")) {
                return (String) response.getBody().get("response");
            } else if (response.getBody() != null && response.getBody().containsKey("answer")) {
                return (String) response.getBody().get("answer");
            }
            return "No response from AI.";
        } catch (Exception e) {
            e.printStackTrace();
            return "Error communicating with AI service: " + e.getMessage();
        }
    }

    public String askRAG(String question) {
        Map<String, String> payload = new HashMap<>();
        payload.put("question", question);
        return postToAI("/api/rag/ask", payload);
    }

    public String getSynonym(String word, String sentence) {
        Map<String, String> payload = new HashMap<>();
        payload.put("word", word);
        payload.put("sentence", sentence);
        return postToAI("/api/features/synonym", payload);
    }

    public String socraticTutor(String question, String context) {
        Map<String, String> payload = new HashMap<>();
        payload.put("question", question);
        payload.put("context", context);
        return postToAI("/api/features/socratic", payload);
    }
}
