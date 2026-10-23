package com.example.quiz.service;

import com.example.quiz.entity.ExamSettings;
import com.example.quiz.repository.ExamSettingsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ExamSettingsService {
    private final ExamSettingsRepository repo;

    public ExamSettings get() {
        return repo.findById(1L).orElseGet(() -> repo.save(new ExamSettings()));
    }

    public ExamSettings update(int questionCount, int durationMinutes) {
        ExamSettings s = get();
        s.setQuestionCount(questionCount);
        s.setDurationMinutes(durationMinutes);
        return repo.save(s);
    }
}
