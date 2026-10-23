package com.example.quiz.controller;

import com.example.quiz.dto.CategoryStat;
import com.example.quiz.dto.DashboardResponse;
import com.example.quiz.dto.UserResponse;
import com.example.quiz.repository.*;
import com.example.quiz.service.ExamSettingsService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {
    private final UserRepository userRepo;
    private final CategoryRepository categoryRepo;
    private final QuestionRepository questionRepo;
    private final AttemptRepository attemptRepo;
    private final ExamSettingsService settingsService;

    @GetMapping("/dashboard")
    public DashboardResponse dashboard() {
        int needed = settingsService.get().getQuestionCount();
        List<CategoryStat> stats = categoryRepo.findAll().stream().map(c -> {
            long count = questionRepo.countByCategoryId(c.getId());
            return new CategoryStat(c.getId(), c.getName(), count, count >= needed);
        }).toList();
        return new DashboardResponse(userRepo.count(), categoryRepo.count(), questionRepo.count(),
                attemptRepo.count(), needed, stats);
    }

    @GetMapping("/users")
    public List<UserResponse> users() {
        return userRepo.findAll().stream()
                .map(u -> new UserResponse(u.getId(), u.getName(), u.getEmail(), u.getRole().name()))
                .toList();
    }
}
