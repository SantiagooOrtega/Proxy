package com.aiproxy.service;

import com.aiproxy.model.GenerationRequest;
import com.aiproxy.model.GenerationResponse;

public interface AIGenerationService {

    GenerationResponse generate(GenerationRequest request);
}
