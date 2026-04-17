package com.aiproxy.scheduler;

import com.aiproxy.service.UserQuotaService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class QuotaScheduler {

    private static final Logger log = LoggerFactory.getLogger(QuotaScheduler.class);

    private final UserQuotaService userQuotaService;

    public QuotaScheduler(UserQuotaService userQuotaService) {
        this.userQuotaService = userQuotaService;
    }

    @Scheduled(fixedRate = 60000)
    public void resetRateLimits() {
        log.info("Resetting per-minute rate limit counters");
        userQuotaService.resetRateLimits();
    }

    @Scheduled(cron = "0 0 0 1 * *")
    public void resetMonthlyQuotas() {
        log.info("Resetting monthly token quotas");
        userQuotaService.resetMonthlyQuotas();
    }
}
