package com.aiproxy.model;

public class GenerationRequest {

    private String userId;
    private String prompt;
    private String model = "mock-gpt";

    public GenerationRequest() {}

    public GenerationRequest(String userId, String prompt, String model) {
        this.userId = userId;
        this.prompt = prompt;
        this.model = model == null ? "mock-gpt" : model;
    }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getPrompt() { return prompt; }
    public void setPrompt(String prompt) { this.prompt = prompt; }

    public String getModel() { return model; }
    public void setModel(String model) { this.model = model; }
}
