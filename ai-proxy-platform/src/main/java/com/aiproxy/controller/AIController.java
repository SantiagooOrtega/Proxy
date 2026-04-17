package com.aiproxy.controller;

import com.aiproxy.model.GenerationRequest;
import com.aiproxy.model.GenerationResponse;
import com.aiproxy.service.AIGenerationService;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
public class AIController {

    private final AIGenerationService aiServiceChain;

    public AIController(@Qualifier("aiServiceChain") AIGenerationService aiServiceChain) {
        this.aiServiceChain = aiServiceChain;
    }

    @PostMapping("/generate")
    public ResponseEntity<GenerationResponse> generate(@RequestBody GenerationRequest request) {
        if (request.getUserId() == null || request.getUserId().isBlank()) {
            throw new IllegalArgumentException("userId is required");
        }
        if (request.getPrompt() == null || request.getPrompt().isBlank()) {
            throw new IllegalArgumentException("prompt is required");
        }
        return ResponseEntity.ok(aiServiceChain.generate(request));
    }
}
