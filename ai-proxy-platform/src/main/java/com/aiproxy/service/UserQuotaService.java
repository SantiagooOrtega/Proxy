package com.aiproxy.service;

import com.aiproxy.model.DailyUsage;
import com.aiproxy.model.Plan;
import com.aiproxy.model.UserQuota;

import java.util.List;

public interface UserQuotaService {

    UserQuota getOrCreateQuota(String userId);

    /** Atomically checks the rate limit and increments if allowed. Returns false if limit reached. */
    boolean checkAndIncrementRequests(String userId);

    void incrementRequests(String userId);

    void addTokensUsed(String userId, int tokens);

    void upgradePlan(String userId, Plan newPlan);

    void resetRateLimits();

    void resetMonthlyQuotas();

    List<DailyUsage> getHistory(String userId);
}
