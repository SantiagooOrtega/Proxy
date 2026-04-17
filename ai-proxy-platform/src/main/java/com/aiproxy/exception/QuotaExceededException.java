package com.aiproxy.exception;

public class QuotaExceededException extends RuntimeException {

    private final String userId;

    public QuotaExceededException(String userId) {
        super("Monthly token quota exceeded for user: " + userId);
        this.userId = userId;
    }

    public String getUserId() {
        return userId;
    }
}
