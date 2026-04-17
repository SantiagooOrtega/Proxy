package com.aiproxy.proxy;

import com.aiproxy.exception.QuotaExceededException;
import com.aiproxy.model.GenerationRequest;
import com.aiproxy.model.GenerationResponse;
import com.aiproxy.model.UserQuota;
import com.aiproxy.service.AIGenerationService;
import com.aiproxy.service.UserQuotaService;

public class QuotaProxyService implements AIGenerationService {

    private final AIGenerationService delegate;
    private final UserQuotaService userQuotaService;

    public QuotaProxyService(AIGenerationService delegate, UserQuotaService userQuotaService) {
        this.delegate = delegate;
        this.userQuotaService = userQuotaService;
    }

    @Override
    public GenerationResponse generate(GenerationRequest request) {
        UserQuota quota = userQuotaService.getOrCreateQuota(request.getUserId());

        if (quota.getTokensUsed() >= quota.getPlan().getMaxTokensPerMonth()) {
            throw new QuotaExceededException(request.getUserId());
        }

        GenerationResponse response = delegate.generate(request);
        // Tokens are recorded after generation; addTokensUsed is synchronized internally
        userQuotaService.addTokensUsed(request.getUserId(), response.getTokensUsed());
        return response;
    }
}
