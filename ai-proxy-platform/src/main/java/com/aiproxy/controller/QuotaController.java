package com.aiproxy.controller;

import com.aiproxy.model.DailyUsage;
import com.aiproxy.model.Plan;
import com.aiproxy.model.UserQuota;
import com.aiproxy.service.UserQuotaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/quota")
public class QuotaController {

    private final UserQuotaService userQuotaService;

    public QuotaController(UserQuotaService userQuotaService) {
        this.userQuotaService = userQuotaService;
    }

    @GetMapping("/status")
    public ResponseEntity<UserQuota> getStatus(@RequestParam String userId) {
        return ResponseEntity.ok(userQuotaService.getOrCreateQuota(userId));
    }

    @GetMapping("/history")
    public ResponseEntity<List<DailyUsage>> getHistory(@RequestParam String userId) {
        return ResponseEntity.ok(userQuotaService.getHistory(userId));
    }

    @PostMapping("/upgrade")
    public ResponseEntity<UserQuota> upgradePlan(@RequestParam String userId,
                                                  @RequestParam Plan plan) {
        userQuotaService.upgradePlan(userId, plan);
        return ResponseEntity.ok(userQuotaService.getOrCreateQuota(userId));
    }
}
