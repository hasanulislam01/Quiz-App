package com.example.quiz.dto;

import jakarta.validation.constraints.NotNull;

import java.util.List;

public record SubmitRequest(@NotNull List<AnswerDto> answers) {
}
