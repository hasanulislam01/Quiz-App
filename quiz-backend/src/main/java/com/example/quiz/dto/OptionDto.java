package com.example.quiz.dto;

import jakarta.validation.constraints.NotBlank;

public record OptionDto (Long id, @NotBlank String text, boolean correct) {
}
