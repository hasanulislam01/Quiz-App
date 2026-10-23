package com.example.quiz.dto;

import jakarta.validation.constraints.NotNull;

public record StartRequest(@NotNull Long categoryId) {
}
