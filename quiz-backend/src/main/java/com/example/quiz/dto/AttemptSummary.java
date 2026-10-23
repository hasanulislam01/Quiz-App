package com.example.quiz.dto;

import com.example.quiz.entity.AttemptStatus;

import java.time.Instant;

public record AttemptSummary(Long id, String categoryName, String userName,
                             AttemptStatus status, int score, int total, Instant startedAt) {

//    step 14
}
