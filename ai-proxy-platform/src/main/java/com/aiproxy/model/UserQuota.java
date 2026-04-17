package com.aiproxy.model;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class UserQuota {

    private String userId;
    private Plan plan;
    private int tokensUsed;
    private int requestsThisMinute;
    private LocalDateTime resetDate;
    private List<DailyUsage> history = new ArrayList<>();

    public UserQuota() {}

    public UserQuota(String userId, Plan plan, int tokensUsed, int requestsThisMinute,
                     LocalDateTime resetDate, List<DailyUsage> history) {
        this.userId = userId;
        this.plan = plan;
        this.tokensUsed = tokensUsed;
        this.requestsThisMinute = requestsThisMinute;
        this.resetDate = resetDate;
        this.history = history != null ? history : new ArrayList<>();
    }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public Plan getPlan() { return plan; }
    public void setPlan(Plan plan) { this.plan = plan; }

    public int getTokensUsed() { return tokensUsed; }
    public void setTokensUsed(int tokensUsed) { this.tokensUsed = tokensUsed; }

    public int getRequestsThisMinute() { return requestsThisMinute; }
    public void setRequestsThisMinute(int requestsThisMinute) { this.requestsThisMinute = requestsThisMinute; }

    public LocalDateTime getResetDate() { return resetDate; }
    public void setResetDate(LocalDateTime resetDate) { this.resetDate = resetDate; }

    public List<DailyUsage> getHistory() { return history; }
    public void setHistory(List<DailyUsage> history) { this.history = history; }
}
