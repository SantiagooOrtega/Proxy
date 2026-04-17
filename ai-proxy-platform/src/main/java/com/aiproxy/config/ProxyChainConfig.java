package com.aiproxy.config;

import com.aiproxy.proxy.QuotaProxyService;
import com.aiproxy.proxy.RateLimitProxyService;
import com.aiproxy.service.AIGenerationService;
import com.aiproxy.service.MockAIGenerationService;
import com.aiproxy.service.UserQuotaService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ProxyChainConfig {

    /**
     * Proxy chain: RateLimitProxy -> QuotaProxy -> MockAIService
     *
     * Wired manually here to avoid circular injection issues that arise
     * when Spring tries to resolve multiple AIGenerationService beans by qualifier.
     */
    @Bean("aiServiceChain")
    public AIGenerationService aiServiceChain(MockAIGenerationService mockAIService,
                                               UserQuotaService userQuotaService) {
        AIGenerationService quotaProxy = new QuotaProxyService(mockAIService, userQuotaService);
        return new RateLimitProxyService(quotaProxy, userQuotaService);
    }
}
