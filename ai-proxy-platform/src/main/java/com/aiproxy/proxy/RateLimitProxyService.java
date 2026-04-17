package com.aiproxy.proxy;

import com.aiproxy.exception.RateLimitException;
import com.aiproxy.model.GenerationRequest;
import com.aiproxy.model.GenerationResponse;
import com.aiproxy.service.AIGenerationService;
import com.aiproxy.service.UserQuotaService;

public class RateLimitProxyService implements AIGenerationService {

    private final AIGenerationService delegate;
    private final UserQuotaService userQuotaService;

    public RateLimitProxyService(AIGenerationService delegate, UserQuotaService userQuotaService) {
        this.delegate = delegate;
        this.userQuotaService = userQuotaService;
    }

    @Override
    public GenerationResponse generate(GenerationRequest request) {
        // Atomic check-and-increment prevents race conditions under concurrent requests
        boolean allowed = userQuotaService.checkAndIncrementRequests(request.getUserId());
        if (!allowed) {
            throw new RateLimitException(request.getUserId(), 60);
        }
        return delegate.generate(request);
    }
}
