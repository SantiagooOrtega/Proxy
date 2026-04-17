package com.aiproxy.model;

import java.time.LocalDateTime;

public class GenerationResponse {

    private String userId;
    private String generatedText;
    private int tokensUsed;
    private long processingTimeMs;
    private LocalDateTime timestamp;

    public GenerationResponse() {}

    public GenerationResponse(String userId, String generatedText, int tokensUsed,
                               long processingTimeMs, LocalDateTime timestamp) {
        this.userId = userId;
        this.generatedText = generatedText;
        this.tokensUsed = tokensUsed;
        this.processingTimeMs = processingTimeMs;
        this.timestamp = timestamp;
    }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getGeneratedText() { return generatedText; }
    public void setGeneratedText(String generatedText) { this.generatedText = generatedText; }

    public int getTokensUsed() { return tokensUsed; }
    public void setTokensUsed(int tokensUsed) { this.tokensUsed = tokensUsed; }

    public long getProcessingTimeMs() { return processingTimeMs; }
    public void setProcessingTimeMs(long processingTimeMs) { this.processingTimeMs = processingTimeMs; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}
