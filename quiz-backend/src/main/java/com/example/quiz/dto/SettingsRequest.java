package com.example.quiz.dto;

import jakarta.validation.constraints.Min;

public record SettingsRequest(@Min(1) int questionCount, @Min(1) int durationMinutes) {
}
