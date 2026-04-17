package com.aiproxy.service;

import com.aiproxy.model.DailyUsage;
import com.aiproxy.model.Plan;
import com.aiproxy.model.UserQuota;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class UserQuotaServiceImpl implements UserQuotaService {

    private final ConcurrentHashMap<String, UserQuota> quotaStore = new ConcurrentHashMap<>();
    private final ConcurrentHashMap<String, Object> userLocks = new ConcurrentHashMap<>();

    private Object lockFor(String userId) {
        return userLocks.computeIfAbsent(userId, id -> new Object());
    }

    @Override
    public UserQuota getOrCreateQuota(String userId) {
        return quotaStore.computeIfAbsent(userId, id -> new UserQuota(
                id, Plan.FREE, 0, 0,
                LocalDateTime.now().plusMonths(1),
                new ArrayList<>()
        ));
    }

    @Override
    public void incrementRequests(String userId) {
        synchronized (lockFor(userId)) {
            UserQuota quota = getOrCreateQuota(userId);
            quota.setRequestsThisMinute(quota.getRequestsThisMinute() + 1);
        }
    }

    @Override
    public void addTokensUsed(String userId, int tokens) {
        synchronized (lockFor(userId)) {
            UserQuota quota = getOrCreateQuota(userId);
            quota.setTokensUsed(quota.getTokensUsed() + tokens);
            recordDailyUsage(quota, tokens);
        }
    }

    @Override
    public void upgradePlan(String userId, Plan newPlan) {
        synchronized (lockFor(userId)) {
            getOrCreateQuota(userId).setPlan(newPlan);
        }
    }

    @Override
    public boolean checkAndIncrementRequests(String userId) {
        synchronized (lockFor(userId)) {
            UserQuota quota = getOrCreateQuota(userId);
            if (quota.getRequestsThisMinute() >= quota.getPlan().getMaxRequestsPerMinute()) {
                return false;
            }
            quota.setRequestsThisMinute(quota.getRequestsThisMinute() + 1);
            return true;
        }
    }

    @Override
    public void resetRateLimits() {
        quotaStore.values().forEach(quota -> {
            synchronized (lockFor(quota.getUserId())) {
                quota.setRequestsThisMinute(0);
            }
        });
    }

    @Override
    public void resetMonthlyQuotas() {
        quotaStore.values().forEach(quota -> {
            synchronized (lockFor(quota.getUserId())) {
                quota.setTokensUsed(0);
                quota.getHistory().clear();
                quota.setResetDate(LocalDateTime.now().plusMonths(1));
            }
        });
    }

    @Override
    public List<DailyUsage> getHistory(String userId) {
        synchronized (lockFor(userId)) {
            return List.copyOf(getOrCreateQuota(userId).getHistory());
        }
    }

    private void recordDailyUsage(UserQuota quota, int tokens) {
        LocalDate today = LocalDate.now();
        List<DailyUsage> history = quota.getHistory();

        history.stream()
                .filter(d -> d.getDate().equals(today))
                .findFirst()
                .ifPresentOrElse(
                        d -> {
                            d.setTokensUsed(d.getTokensUsed() + tokens);
                            d.setRequestsCount(d.getRequestsCount() + 1);
                        },
                        () -> {
                            history.add(new DailyUsage(today, tokens, 1));
                            if (history.size() > 7) history.remove(0);
                        });
    }
}
