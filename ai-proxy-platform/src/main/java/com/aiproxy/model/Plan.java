package com.aiproxy.model;

public enum Plan {

    FREE(10, 50000),
    PRO(60, 500000),
    ENTERPRISE(Integer.MAX_VALUE, Integer.MAX_VALUE);

    private final int maxRequestsPerMinute;
    private final int maxTokensPerMonth;

    Plan(int maxRequestsPerMinute, int maxTokensPerMonth) {
        this.maxRequestsPerMinute = maxRequestsPerMinute;
        this.maxTokensPerMonth = maxTokensPerMonth;
    }

    public int getMaxRequestsPerMinute() {
        return maxRequestsPerMinute;
    }

    public int getMaxTokensPerMonth() {
        return maxTokensPerMonth;
    }
}
