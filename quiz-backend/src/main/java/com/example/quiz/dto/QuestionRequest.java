package com.example.quiz.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.List;

public record QuestionRequest(@NotBlank String text,
                              @NotNull Long categoryId,
                              @NotNull @Size(min = 2, message = "at least 2 options are required")
                              List<@Valid OptionDto> options) {
}
