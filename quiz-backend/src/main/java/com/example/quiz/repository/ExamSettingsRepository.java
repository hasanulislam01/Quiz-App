package com.example.quiz.repository;

import com.example.quiz.entity.ExamSettings;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ExamSettingsRepository extends JpaRepository<ExamSettings, Long> {
}
