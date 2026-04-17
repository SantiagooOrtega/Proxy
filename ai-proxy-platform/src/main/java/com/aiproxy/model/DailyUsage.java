package com.aiproxy.model;

import java.time.LocalDate;

public class DailyUsage {

    private LocalDate date;
    private int tokensUsed;
    private int requestsCount;

    public DailyUsage() {}

    public DailyUsage(LocalDate date, int tokensUsed, int requestsCount) {
        this.date = date;
        this.tokensUsed = tokensUsed;
        this.requestsCount = requestsCount;
    }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public int getTokensUsed() { return tokensUsed; }
    public void setTokensUsed(int tokensUsed) { this.tokensUsed = tokensUsed; }

    public int getRequestsCount() { return requestsCount; }
    public void setRequestsCount(int requestsCount) { this.requestsCount = requestsCount; }
}
