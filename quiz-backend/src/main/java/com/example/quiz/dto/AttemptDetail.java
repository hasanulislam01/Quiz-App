package com.example.quiz.dto;

import com.example.quiz.entity.AttemptStatus;

import java.time.Instant;
import java.util.List;

public record AttemptDetail(Long id, Long categoryId, String categoryName, String userName,
                            AttemptStatus status, int score, int total, Instant startedAt,
                            long remainingSeconds,
                            List<ExamQuestionView> questions,   // only while IN_PROGRESS
                            List<ReviewItem> review) {
}  // only after the exam ends
