package com.aiproxy.exception;

public class RateLimitException extends RuntimeException {

    private final String userId;
    private final int retryAfterSeconds;

    public RateLimitException(String userId, int retryAfterSeconds) {
        super("Rate limit exceeded for user: " + userId + ". Retry after " + retryAfterSeconds + " seconds.");
        this.userId = userId;
        this.retryAfterSeconds = retryAfterSeconds;
    }

    public String getUserId() {
        return userId;
    }

    public int getRetryAfterSeconds() {
        return retryAfterSeconds;
    }
}
