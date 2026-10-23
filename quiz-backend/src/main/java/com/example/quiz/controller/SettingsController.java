package com.example.quiz.controller;

import com.example.quiz.dto.SettingsRequest;
import com.example.quiz.entity.ExamSettings;
import com.example.quiz.service.ExamSettingsService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class SettingsController {
    private final ExamSettingsService service;

    @GetMapping("/api/settings")          // any logged-in user: shows the exam rules
    public ExamSettings userView() { return service.get(); }

    @GetMapping("/api/admin/settings")
    public ExamSettings adminView() { return service.get(); }

    @PutMapping("/api/admin/settings")
    public ExamSettings update(@Valid @RequestBody SettingsRequest r) {
        return service.update(r.questionCount(), r.durationMinutes());
    }
}
